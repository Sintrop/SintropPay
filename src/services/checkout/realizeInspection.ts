/* eslint-disable @typescript-eslint/ban-ts-comment */
import { TransactionCheckoutProps } from "@/interfaces/transactionsCheckout";
import { ReturnTransactionProps } from "../web3/V7/RCToken";
import { getInspection, realizeInspection } from "../web3/V7/Sintrop";
import { getProducer } from "../web3/V7/Producer";
import { api } from "../api";
import { IndiceProps, InspectioApiProps, ResultIndicesProps, ResultSubCategoryProps, SpringProps, ZoneProps } from "@/interfaces/inspection";
import { format } from "date-fns";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { saveToIpfs } from "../ipfsInfura";
import { finishTransaction } from "./transactions";
import { createPubliFeed } from "./publicationFeed";
//@ts-ignore
(<any>pdfMake).addVirtualFileSystem(pdfFonts);

interface AdditionalDataRealizeInspectionProps {
    inspectionId: string;
}
interface ExecuteRealizeInspectionProps {
    transactionCheckoutData: TransactionCheckoutProps;
    walletConnected: string;
}
export async function executeRealizeInspection(props: ExecuteRealizeInspectionProps): Promise<ReturnTransactionProps> {
    const { transactionCheckoutData, walletConnected } = props;
    let additionalData = {} as AdditionalDataRealizeInspectionProps;
    if (transactionCheckoutData.additionalData) {
        additionalData = JSON.parse(transactionCheckoutData.additionalData);
    }

    const responseBefore = await beforeRealizeInspection({
        inspectionId: additionalData.inspectionId,
        walletConnected
    });

    if(responseBefore.success){
        const responseWeb3 = await realizeInspection({
            inspectionId: additionalData.inspectionId,
            isas: responseBefore.isas,
            proofPhoto: responseBefore.proofPhoto,
            report: responseBefore.reportHash,
            walletConnected
        });

        if(responseWeb3.success){
            await afterRealizeInspection({
                transactionId: transactionCheckoutData.id,
                transactionHash: responseWeb3.transactionHash,
                inspectionId: additionalData.inspectionId,
                walletConnected,
                producerWallet: responseBefore.producerWallet
            })
        }

        return responseWeb3;  
    }else{
        return {
            code: 500,
            message: responseBefore?.message as string,
            success: false,
            transactionHash: ''
        }
    }
}

interface BeforeRealizeInspectionProps {
    inspectionId: string;
    walletConnected: string;
}
interface ReturnBeforeReealizeInspectioProps {
    success: boolean;
    message?: string;
    reportHash: string;
    isas: IsaProps[];
    proofPhoto: string;
    producerWallet?: string;
}
async function beforeRealizeInspection(props: BeforeRealizeInspectionProps): Promise<ReturnBeforeReealizeInspectioProps> {
    const { inspectionId, walletConnected } = props;

    const inspection = await getInspection(inspectionId);
    if (inspection.status === 2) {
        return {
            success: false,
            message: 'inspection is finished',
            isas: [],
            reportHash: '',
            proofPhoto: ''
        }
    }
    const producer = await getProducer(inspection.producer);

    const responseInspectionApi = await api.get(`/inspection/${inspectionId}`);
    const inspectionApi = responseInspectionApi.data.inspection as InspectioApiProps;
    if (inspectionApi.status === 1) {
        return {
            success: false,
            message: 'finish inspection on app mobile',
            isas: [],
            reportHash: '',
            proofPhoto: ''
        }
    }

    const responseIndices = await api.get('/subCategories');
    const indices = responseIndices.data.subCategories as IndiceProps[];

    let resultCategories = [] as ResultSubCategoryProps[];
    if(inspectionApi?.resultCategories){
        resultCategories = JSON.parse(inspectionApi?.resultCategories);
    }

    let resultZones = [] as ZoneProps[];
    if(inspectionApi?.zones){
        resultZones = JSON.parse(inspectionApi?.zones);
    }

    let springs = [] as SpringProps[];
    if (inspectionApi?.springs) {
        const jsonSprings = JSON.parse(inspectionApi?.springs);
        springs = jsonSprings;
    }

    //Função que calcula os indices e retorna os dados para o pdf
    const responseCalculo = await calculateIndices({indices, resultCategories, resultZones, springs});
    await updateResultApi({inspectionId, result: JSON.stringify(responseCalculo)});
    const isasResponse = await createIsas({resultIndices: responseCalculo.resultIndices});
    

    const infoData = {
        producerWallet: producer?.producerWallet,
        producerName: producer?.name,
        producerArea: producer?.areaInformation?.totalArea,
        inspectorWallet: walletConnected,
        date: format(new Date(), 'dd/MM/yyyy - kk:mm')
    }

    const indicators = {
        carbon: calculateCarboon(responseCalculo.resultIndices) as number,
        water: calculateWater(responseCalculo.resultIndices) as number,
        soil: calculateSolo(responseCalculo.resultIndices) as number,
        bio: calculateBio(responseCalculo.resultIndices) as number,
    }

    let hashReport = '';
    let success = false;
    //@ts-ignore
    await pdfMake.createPdf(contentPdf({infoData, inspection: inspectionApi, pdfData: responseCalculo.pdfData, resultIndices: responseCalculo.resultIndices, indicators})).getBuffer()
    //@ts-ignore
    .then(async (res) => {
        const hash = await saveToIpfs(res);
        hashReport = hash as string;
        success = true;
    })
    .catch((err: any) => {
        console.log('error on create pdf')
        console.log(err);
    })

    return {
        success,
        isas: isasResponse.arrayIsas,
        reportHash: hashReport,
        proofPhoto: inspectionApi.proofPhoto as string,
        producerWallet: producer.producerWallet,
    }
}

interface CalculateIndicesProps{
    indices: IndiceProps[];
    resultCategories: ResultSubCategoryProps[];
    resultZones: ZoneProps[];
    springs: SpringProps[];
}
async function calculateIndices(props: CalculateIndicesProps) {
    const {indices, resultCategories, resultZones, springs} = props;
    const indiceAnaliseSolo = indices.filter(item => item.id === '14');
    const indiceMultiplicadorRaiz = indices.filter(item => item.id === '27');
    const indicePercentAguaEstocada = indices.filter(item => item.id === '28');
    const indiceCarbonBiomassaSeca = indices.filter(item => item.id === '29');
    const indiceFatorUmidade = indices.filter(item => item.id === '30');

    let bodyInsumos = [];
    for (var i = 0; i < indices.length; i++) {
        let row = [];
        row.push(indices[i].title);
        row.push(indices[i].unity);
        row.push(indices[i].carbonValue);
        row.push(indices[i].aguaValue);
        row.push(indices[i].soloValue);
        row.push(indices[i].bioValue);

        if (indices[i].insumoCategory === 'insumo-quimico' || indices[i].insumoCategory === 'insumo-biologico' || indices[i].insumoCategory === 'insumo-mineral' || indices[i].insumoCategory === 'recurso-externo') {
            bodyInsumos.push(row);
        }
    }

    let bodyResiduos = [];
    for (var i = 0; i < indices.length; i++) {
        let row = [];
        row.push(indices[i].title);
        row.push(indices[i].unity);
        row.push(indices[i].carbonValue);
        row.push(indices[i].aguaValue);
        row.push(indices[i].soloValue);
        row.push(indices[i].bioValue);

        if (indices[i].insumoCategory === 'embalagens') {
            bodyResiduos.push(row);
        }
    }

    let bodyIndices = [];
    for (var i = 0; i < indices.length; i++) {
        let row = [];
        row.push(indices[i].title);
        row.push(indices[i].unity);
        row.push(indices[i].carbonValue);
        row.push(indices[i].aguaValue);
        row.push(indices[i].soloValue);
        row.push(indices[i].bioValue);

        if (indices[i].insumoCategory === 'arvores' || indices[i].insumoCategory === 'biomassa') {
            bodyIndices.push(row);
        }
    }

    let bodyResultInsumos = [];

    //Variaveis da degeneração
    let bodyDegradacao = [];
    let degenerationCarbon = 0;
    let degenerationWater = 0;
    let degenerationSoil = 0;
    let degenerationBio = 0;

    //Variaveis da biodiversidade
    let bodyBio = [];

    //For para calcular os resultados dos insumos
    for (var i = 0; i < resultCategories.length; i++) {
        const category = JSON.parse(resultCategories[i].categoryDetails);

        //Lista os insumos registrados na inspeção
        if (resultCategories[i].value !== 0) {
            let row = [];
            row.push(resultCategories[i].title);
            row.push(resultCategories[i].value);
            row.push(category.unity);

            if (category.id === '9' || category.id === '10' || category.id === '11' || category.id === '12' || category.id === '23') {
            } else {
                bodyResultInsumos.push(row);
            }
        }

        //Faz a contagem dos insumos de degeneração
        if (category.category === '1') {
            if (resultCategories[i].value !== 0) {
                let row = [];
                row.push(resultCategories[i].title);
                row.push(`${resultCategories[i].value} x ${category.carbonValue} = ${(Number(resultCategories[i].value) * Number(category.carbonValue)).toFixed(1)} kg`);
                row.push(`${resultCategories[i].value} x ${category.aguaValue} = ${(Number(resultCategories[i].value) * Number(category.aguaValue)).toFixed(1)} m³`);
                row.push(`${resultCategories[i].value} x ${category.soloValue} = ${(Number(resultCategories[i].value) * Number(category.soloValue)).toFixed(1)} m²`);
                row.push(`${resultCategories[i].value} x ${category.bioValue} = ${(Number(resultCategories[i].value) * Number(category.bioValue)).toFixed(1)} uni`);

                bodyDegradacao.push(row);

                //Faz a soma da degeneração
                degenerationCarbon += Number(resultCategories[i].value) * Number(category.carbonValue);
                degenerationWater += Number(resultCategories[i].value) * Number(category.aguaValue);
                degenerationSoil += Number(resultCategories[i].value) * Number(category.soloValue);
                degenerationBio += Number(resultCategories[i].value) * Number(category.bioValue);
            }
        }
    }

    //Análise das zonas
    let saldoCarbonAnaliseSoloZones = 0;
    let saldoSoilAnaliseSoloZones = 0;
    let bodyCoordsZonesTeste = [];
    let bodyAnaliseSoloZones = [];

    //novo método

    let bodySampling1 = [];
    let volumeTotalZonas = 0;
    let totalAguaEstocadaZones = 0;
    let totalCarbonEstocadoZones = 0;
    let bodyAguaEstocada = [];
    let bodyCarbonoEstocado = [];
    let bodyVolumeZones = [];
    let estimatedTreesTotal = 0;
    let bodyEstimatedTrees = [];
    let rowPhotosZone = [];

    //variaveis do registro de biodiversidade nas zonas
    let rowAnaliseBio = [];
    let totalBioZones = 0;

    //Variáveis da biodivesidade no solo
    let totalSoilBio = 0;
    let bodySoilBioPhoto = [];

    //For para calcular os resultados das zonas
    for (var i = 0; i < resultZones.length; i++) {
        let volumeTotalSampling1 = 0;
        let volumeAmostraAereaSampling1 = 0;

        const zone = resultZones[i];
        const titleZone = resultZones[i].title;
        const pathZone = resultZones[i].path;
        const areaZone = Number(zone.areaZone);
        const photosZone = resultZones[i].photosZone;
        const bioSoil = resultZones[i].bioSoil;
        const analiseBio = resultZones[i].analiseBio;

        const treesS1 = zone.arvores?.sampling1?.trees;

        //Faz a estimativa de árvores da zona e monta o array da tabela do pdf
        let estimatedTreeZone = 0;
        let rowTreesZone = [];

        const estimatedTree = Number(areaZone * (treesS1.length / Number(zone.arvores?.sampling1.area)));
        estimatedTreeZone += Number(estimatedTree.toFixed(0));

        const rowTree = [
            titleZone,
            `${areaZone.toFixed(2).replace('.', ',')}`,
            `${treesS1.length}`,
            `${Number(zone.arvores?.sampling1.area)}`,
            `${areaZone.toFixed(2).replace('.', ',')} x (${treesS1.length} / ${Number(zone.arvores?.sampling1.area)})`,
            `${estimatedTree.toFixed(0)}`
        ];
        rowTreesZone = rowTree;

        bodyEstimatedTrees.push(rowTreesZone);
        estimatedTreesTotal += Number(estimatedTreeZone);

        //For para listar e calcular cada árvore registrada
        for (var s1 = 0; s1 < treesS1.length; s1++) {
            const height = Number(treesS1[s1].height);
            const diameter = Number(treesS1[s1].ray);
            const ray = (diameter / 2) / 100;

            const volumeTree = 3.14159 * (Number(ray ** 2) * Number(height));
            volumeAmostraAereaSampling1 += Number(volumeTree);

            let row = [];
            let imgTree = {
                text: `Foto`,
                link: `https://${window.location.host}/view-image/${treesS1[s1].photo}`,
                style: 'link'
            }

            row.push(titleZone);
            row.push(`Lat: ${treesS1[s1]?.lat}, Lng: ${treesS1[s1]?.lng}`);
            row.push(`${treesS1[s1].ray}`);
            row.push(`${treesS1[s1].height}`);
            row.push(imgTree);
            row.push(`${(volumeTree * Number(indiceMultiplicadorRaiz[0].carbonValue)).toFixed(4).replace('.', ',')}`);
            row.push(`1 - ${zone?.arvores?.sampling1?.area} m²`);

            bodySampling1.push(row);
        }

        const totalSampling1 = Number(volumeAmostraAereaSampling1) * Number(indiceMultiplicadorRaiz[0].carbonValue);
        volumeTotalSampling1 = Number(totalSampling1);

        let volumeZona = 0;
        let volumeTotalAmostragem = 0
        let areaTotalAmostragem = 0;

        volumeZona = areaZone * ((Number(volumeTotalSampling1) / Number(zone.arvores?.sampling1?.area)));
        areaTotalAmostragem += Number(zone.arvores?.sampling1?.area);
        volumeTotalAmostragem += Number(volumeTotalSampling1);
        volumeTotalZonas += volumeZona;

        let aguaEstocada = volumeZona * Number(indicePercentAguaEstocada[0].aguaValue);
        totalAguaEstocadaZones += aguaEstocada;

        let biomassaSeca = volumeZona - Number(aguaEstocada);
        const carbonoEstocado = Number(biomassaSeca) * Number(indiceCarbonBiomassaSeca[0].carbonValue);
        totalCarbonEstocadoZones += Number(carbonoEstocado);

        bodyVolumeZones.push([
            titleZone,
            `${areaZone.toFixed(2).replace('.', ',')}`,
            `${volumeTotalAmostragem.toFixed(4).replace('.', ',')}`,
            `${areaTotalAmostragem.toFixed(2).replace('.', ',')}`,
            `${areaZone.toFixed(2).replace('.', ',')} m² x (${volumeTotalAmostragem.toFixed(4).replace('.', ',')} m³ / ${areaTotalAmostragem.toFixed(2).replace('.', ',')} m²)`,
            `${volumeZona.toFixed(4).replace('.', ',')}`,
        ]);

        //Monta a tabela da água estocada
        let bodyAgua = [
            titleZone,
            `${Number(volumeZona).toFixed(4).replace('.', ',')}`,
            `${Number(volumeZona).toFixed(4).replace('.', ',')} x ${Number(indicePercentAguaEstocada[0].aguaValue)}`,
            `${aguaEstocada?.toFixed(2).replace('.', ',')}`,
        ];

        bodyAguaEstocada.push(bodyAgua);

        //Monta a tabela do carbono estocad0
        let bodyCarbono = [
            titleZone,
            `${Number(volumeZona).toFixed(4).replace('.', ',')}`,
            `${aguaEstocada?.toFixed(2).replace('.', ',')}`,
            `${Number(volumeZona).toFixed(4).replace('.', ',')} - ${aguaEstocada?.toFixed(4).replace('.', ',')} = ${(Number(volumeZona) - Number(aguaEstocada)).toFixed(2).replace('.', ',')}`,
            `${(Number(volumeZona) - Number(aguaEstocada)).toFixed(2).replace('.', ',')} x ${Number(indicePercentAguaEstocada[0].aguaValue)}`,
            `${carbonoEstocado?.toFixed(2).replace('.', ',')}`,
        ];

        bodyCarbonoEstocado.push(bodyCarbono);

        //Monta a tabela com coordenadas e área de cada zona
        let bodyTeste = [
            titleZone,
        ];
        let stringCoords = '';
        for (var c = 0; c < pathZone.length; c++) {
            stringCoords += `| Ponto ${c + 1} - Lat: ${pathZone[c].lat}, Lng: ${pathZone[c].lng} `;
        }
        bodyTeste.push(stringCoords);
        bodyTeste.push(`${(resultZones[i].areaZone).toFixed(0)} m²`);
        bodyCoordsZonesTeste.push(bodyTeste);

        const analiseSolo = resultZones[i].analiseSolo;

        //Faz o cálculo da biomassa da zona
        let biomassaSolo = 0;
        saldoSoilAnaliseSoloZones += resultZones[i].areaZone;

        if (resultZones[i]?.soilUmid) {
            const calculoBiomassaSolo = (Number((((Number(analiseSolo[0].value) + Number(analiseSolo[1].value) + Number(analiseSolo[2].value) + Number(analiseSolo[3].value)) / 4) / 0.5) * resultZones[i].areaZone) * Number(indiceAnaliseSolo[0].carbonValue)) * Number(indiceFatorUmidade[0].carbonValue);
            saldoCarbonAnaliseSoloZones += calculoBiomassaSolo;
            biomassaSolo += calculoBiomassaSolo;
        } else {
            const calculoBiomassaSolo = Number((((Number(analiseSolo[0].value) + Number(analiseSolo[1].value) + Number(analiseSolo[2].value) + Number(analiseSolo[3].value)) / 4) / 0.5) * resultZones[i].areaZone) * Number(indiceAnaliseSolo[0].carbonValue);
            saldoCarbonAnaliseSoloZones += calculoBiomassaSolo;
            biomassaSolo += calculoBiomassaSolo;
        }

        //Monta o item da tabela para a análise de solo;
        const analiseSoloZone = [
            titleZone,
            `${areaZone.toFixed(2).replace('.', ',')}`,
            `${analiseSolo[0].value}`,
            `${analiseSolo[1].value}`,
            `${analiseSolo[2].value}`,
            `${analiseSolo[3].value}`,
            '0,5',
            `${resultZones[i]?.soilUmid ? 'Sim' : 'Não'}`,
            `(((${analiseSolo[0].value} + ${analiseSolo[1].value} + ${analiseSolo[2].value} + ${analiseSolo[3].value} / 4) / 0,5) x ${areaZone.toFixed(2).replace('.', ',')}) x ${indiceAnaliseSolo[0].carbonValue}`,
            `${(biomassaSolo).toFixed(2).replace('.', ',')} kg`
        ]
        bodyAnaliseSoloZones.push(analiseSoloZone);

        //Imagem das zonas
        for (var p = 0; p < photosZone.length; p++) {
            const dataImage = {
                text: `${photosZone[p].photo}`,
                link: `https://${window.location.host}/view-image/${photosZone[p].photo}`,
                style: 'link'
            }
            let row = []
            row.push(titleZone);
            row.push(dataImage);
            rowPhotosZone.push(row);
        }

        //Cáculo da biodiversidade no solo de cada zona
        for (var s = 0; s < bioSoil.length; s++) {
            totalSoilBio += Number(bioSoil[s].value);

            const dataImage = {
                text: `Foto`,
                link: `https://app.sintrop.com/view-image/${bioSoil[s].photo}`,
                style: 'link'
            }
            let row = []
            row.push(titleZone);
            row.push(`Lat: ${bioSoil[s]?.coord?.lat}, Lng: ${bioSoil[s]?.coord?.lng}`)
            row.push(dataImage);
            row.push(bioSoil[s]?.value)

            bodySoilBioPhoto.push(row);
        }

        //Calculo e montagem da tabela do registro de biodiversidade da zona
        for (var p = 0; p < analiseBio.length; p++) {
            totalBioZones += 1;

            const dataImage = {
                text: `Foto`,
                link: `https://app.sintrop.com/view-image/${analiseBio[p].photo}`,
                style: 'link'
            }
            let row = []
            row.push(titleZone);
            row.push(dataImage);
            row.push(analiseBio[p]?.type)
            row.push(analiseBio[p]?.especieSelected?.name)
            rowAnaliseBio.push(row);
        }
    }

    let rowSoilBio = [
        'Solo',
        `${totalSoilBio}`,
    ];

    let rowBioZones = [
        'Zonas',
        `${totalBioZones}`,
    ];
    bodyBio.push(rowSoilBio);
    bodyBio.push(rowBioZones);
    const totalBioRegistered = Number(totalSoilBio) + totalBioZones;

    let rowBioTotal = [
        'Total',
        `${Number(totalBioRegistered).toFixed(0)} uv`
    ]

    bodyBio.push(rowBioTotal);

    //Verifica e calcula as nascentes
    let totalWaterSprings = 0;
    let bodySprings = [];
    if (springs.length > 0) {
        for (var sp = 0; sp < springs.length; sp++) {
            if (Number(springs[sp].value) > 20) {
                totalWaterSprings += 1000;
            }
            if (Number(springs[sp].value) <= 20) {
                totalWaterSprings += 100;
            }
            const dataImage = {
                text: `${springs[sp].photo}`,
                link: `https://${window.location.host}/view-image/${springs[sp].photo}`,
                style: 'link'
            }

            let row = [];
            row.push(`Lat: ${springs[sp].coord.lat} | Lng: ${springs[sp].coord.lng}`);
            row.push(dataImage);
            row.push(`${springs[sp].value} cm`);
            bodySprings.push(row);
        }
    }

    let totalCarbon = degenerationCarbon + ((totalCarbonEstocadoZones * -1) * 1000) + saldoCarbonAnaliseSoloZones;
    let totalWater = degenerationWater + totalAguaEstocadaZones + totalWaterSprings;
    let totalBio = degenerationBio + totalSoilBio + totalBioZones;
    let totalSoil = degenerationSoil + saldoSoilAnaliseSoloZones;

    const resultIndices = {
        carbon: Number(totalCarbon.toFixed(2)),
        water: Number(totalWater.toFixed(2)),
        bio: Number(totalBio.toFixed(2)),
        soil: Number(totalSoil.toFixed(2)),
    } as ResultIndicesProps;

    const pdfData = {
        bodyDegradacao,
        bodyResultInsumos,
        bodyInsumos,
        degenerationCarbon,
        degenerationWater,
        degenerationSoil,
        degenerationBio,
        saldoCarbonAnaliseSoloZones,
        saldoSoilAnaliseSoloZones,
        bodyAnaliseSoloZones,
        bodyCoordsZonesTeste,
        bodySampling1,
        bodyAguaEstocada,
        bodyCarbonoEstocado,
        totalAguaEstocadaZones,
        totalCarbonEstocadoZones,
        bodyVolumeZones,
        bodyResiduos,
        bodyIndices,
        bodyBio,
        volumeTotalZonas,
        estimatedTreesTotal,
        bodyEstimatedTrees,
        bodySoilBioPhoto,
        totalSoilBio,
        rowPhotosZone,
        totalWaterSprings,
        bodySprings,
        rowAnaliseBio,
        totalBioZones
    }

    return {
        resultIndices,
        pdfData
    }
}

interface CreateIsasProps{
    resultIndices: ResultIndicesProps;
}
export interface IsaProps{
    categoryId: number; 
    isaId: number;
    indicator: number;
}
interface ReturnCreateIsasProps{
    arrayIsas: IsaProps[]
}
async function createIsas(props: CreateIsasProps): Promise<ReturnCreateIsasProps>{
    const {resultIndices} = props;
    const carbonResult = calculateCarboon(resultIndices);
    const waterResult = calculateWater(resultIndices);
    const bioResult = calculateBio(resultIndices);
    const soloResult = calculateSolo(resultIndices);

    const carbon = {
        categoryId: 1,
        isaIndex: carbonResult,
        indicator: Math.floor(resultIndices.carbon)
    }

    const bio = {
        categoryId: 2,
        isaIndex: bioResult,
        indicator: Math.floor(resultIndices.bio)
    }

    const water = {
        categoryId: 3,
        isaIndex: waterResult,
        indicator: Math.floor(resultIndices.water)
    }

    const solo = {
        categoryId: 4,
        isaIndex: soloResult,
        indicator: Math.floor(resultIndices.soil)
    }

    const arrayIsas = [
        { categoryId: carbon.categoryId, isaId: carbon.isaIndex, indicator: carbon.indicator },
        { categoryId: bio.categoryId, isaId: bio.isaIndex, indicator: bio.indicator },
        { categoryId: water.categoryId, isaId: water.isaIndex, indicator: water.indicator },
        { categoryId: solo.categoryId, isaId: solo.isaIndex, indicator: solo.indicator },
    ] as IsaProps[];

    return {
        arrayIsas,
    }
}

interface UpdateResultApiProps{
    inspectionId: string;
    result: string;
}
async function updateResultApi(props: UpdateResultApiProps){
    const {inspectionId, result} = props;
    try{
        await api.put('/update-result', {
            id: inspectionId,
            result: result,
        })
    }catch(e){
        console.log(e)
    }
}

function calculateCarboon(data: ResultIndicesProps) {
    let result = 3;
    const carbon = data.carbon;

    if (carbon < 0) {
        if (Math.abs(carbon) > 0 && Math.abs(carbon) < 10000) {
            result = 6
        }
        if (Math.abs(carbon) >= 10000 && Math.abs(carbon) < 100000) {
            result = 5
        }
        if (Math.abs(carbon) >= 100000 && Math.abs(carbon) < 1000000) {
            result = 4
        }
        if (Math.abs(carbon) >= 1000000 && Math.abs(carbon) < 10000000) {
            result = 3
        }
        if (Math.abs(carbon) >= 10000000 && Math.abs(carbon) < 100000000) {
            result = 2
        }
        if (Math.abs(carbon) >= 100000000) {
            result = 1
        }
    }
    if (carbon >= 100000000) {
        result = 13
    }
    if (carbon >= 10000000 && carbon < 100000000) {
        result = 12
    }
    if (carbon >= 1000000 && carbon < 10000000) {
        result = 11
    }
    if (carbon >= 100000 && carbon < 1000000) {
        result = 10
    }
    if (carbon >= 10000 && carbon < 100000) {
        result = 9
    }
    if (carbon > 0 && carbon < 10000) {
        result = 8
    }
    if (carbon === 0) {
        result = 7
    }

    return result;
}

function calculateWater(data: ResultIndicesProps) {
    let result = 0;
    const water = data.water;

    if (water < 0) {
        if (Math.abs(water) > 0 && Math.abs(water) < 10) {
            result = 8
        }
        if (Math.abs(water) < 100 && Math.abs(water) >= 10) {
            result = 9
        }
        if (Math.abs(water) < 1000 && Math.abs(water) >= 100) {
            result = 10
        }
        if (Math.abs(water) < 10000 && Math.abs(water) >= 1000) {
            result = 11
        }
        if (Math.abs(water) < 100000 && Math.abs(water) >= 10000) {
            result = 12
        }
        if (Math.abs(water) >= 100000) {
            result = 13
        }
    }
    if (water >= 100000) {
        result = 1
    }
    if (water >= 10000 && water < 100000) {
        result = 2
    }
    if (water >= 1000 && water < 10000) {
        result = 3
    }
    if (water >= 100 && water < 1000) {
        result = 4
    }
    if (water >= 10 && water < 100) {
        result = 5
    }
    if (water > 0 && water < 10) {
        result = 6
    }
    if (water === 0) {
        result = 7
    }

    return result;
}

function calculateBio(data: ResultIndicesProps) {
    let result = 0;
    const bio = Number(data.bio);

    if (bio < 0) {
        if (Math.abs(bio) > 0 && Math.abs(bio) < 10) {
            result = 8
            return result;
        }
        if (Math.abs(bio) >= 10 && Math.abs(bio) < 50) {
            result = 9
            return result;
        }
        if (Math.abs(bio) >= 50 && Math.abs(bio) < 100) {
            result = 10
            return result;
        }
        if (Math.abs(bio) >= 100 && Math.abs(bio) < 200) {
            result = 11
            return result;
        }
        if (Math.abs(bio) >= 200 && Math.abs(bio) < 1000) {
            result = 12
            return result;
        }
        if (Math.abs(bio) >= 1000) {
            result = 13
            return result;
        }
    }
    if (bio >= 1000) {
        result = 1
        return result;
    }
    if (bio < 1000 && bio >= 200) {
        result = 2
        return result;
    }
    if (bio < 200 && bio >= 100) {
        result = 3
        return result;
    }
    if (bio < 100 && bio >= 50) {
        result = 4
        return result;
    }
    if (bio < 50 && bio >= 10) {
        result = 5
        return result;
    }
    if (bio < 10 && bio > 0) {
        result = 6
        return result;
    }
    if (bio === 0) {
        result = 7
        return result;
    }
}

function calculateSolo(data: ResultIndicesProps) {
    const soil = Number(data.soil) / 10000;

    let result = 0;
    if (soil < 0) {
        if (Math.abs(soil) > 0 && Math.abs(soil) < 1) {
            result = 8
        }
        if (Math.abs(soil) < 2 && Math.abs(soil) >= 1) {
            result = 9
        }
        if (Math.abs(soil) < 10 && Math.abs(soil) >= 2) {
            result = 10
        }
        if (Math.abs(soil) < 100 && Math.abs(soil) >= 10) {
            result = 11
        }
        if (Math.abs(soil) < 1000 && Math.abs(soil) >= 100) {
            result = 12
        }
        if (Math.abs(soil) >= 1000) {
            result = 13
        }
    }
    if (soil >= 1000) {
        result = 1
    }
    if (soil >= 100 && soil < 1000) {
        result = 2
    }
    if (soil >= 10 && soil < 100) {
        result = 3
    }
    if (soil >= 2 && soil < 10) {
        result = 4
    }
    if (soil >= 1 && soil < 2) {
        result = 5
    }
    if (soil > 0 && soil < 1) {
        result = 6
    }
    if (soil === 0) {
        result = 7
    }

    return result;
}

interface ContentPdfProps{
    infoData: {
        producerWallet: string;
        producerName: string;
        producerArea: number;
        inspectorWallet: string;
        date: string;
    }
    resultIndices: ResultIndicesProps;
    inspection: InspectioApiProps;
    pdfData: any;
    indicators: {
        carbon: number;
        bio: number;
        soil: number;
        water: number;
    };
}
function contentPdf(props: ContentPdfProps) {
    const {infoData, resultIndices, inspection, pdfData, indicators} = props;
    const {
        bodyInsumos,
        bodyResultInsumos,
        bodyDegradacao,
        degenerationCarbon,
        degenerationWater,
        degenerationSoil,
        degenerationBio,
        saldoCarbonAnaliseSoloZones,
        saldoSoilAnaliseSoloZones,
        bodyAnaliseSoloZones,
        bodyCoordsZonesTeste,
        bodySampling1,
        bodyAguaEstocada,
        totalAguaEstocadaZones,
        totalCarbonEstocadoZones,
        bodyVolumeZones,
        bodyResiduos,
        bodyIndices,
        bodyBio,
        bodyCarbonoEstocado,
        volumeTotalZonas,
        estimatedTreesTotal,
        bodyEstimatedTrees,
        bodySoilBioPhoto,
        totalSoilBio,
        rowPhotosZone,
        totalWaterSprings,
        bodySprings,
        rowAnaliseBio,
        totalBioZones
    } = pdfData;

    let isaCarbon = '';
    let isaWater = '';
    let isaSoil = '';
    let isaBio = '';

    //Transforma o isaindex em uma string legivel;
    if (indicators) {
        if (indicators.carbon === 1) {
            isaCarbon = 'Regenerativo 6 = +25 Pontos de Regeneração'
        }
        if (indicators.carbon === 2) {
            isaCarbon = 'Regenerativo 5 = +16 Pontos de Regeneração'
        }
        if (indicators.carbon === 3) {
            isaCarbon = 'Regenerativo 4 = +8 Pontos de Regeneração'
        }
        if (indicators.carbon === 4) {
            isaCarbon = 'Regenerativo 3 = +4 Pontos de Regeneração'
        }
        if (indicators.carbon === 5) {
            isaCarbon = 'Regenerativo 2 = +2 Pontos de Regeneração'
        }
        if (indicators.carbon === 6) {
            isaCarbon = 'Regenerativo 1 = +1 Pontos de Regeneração'
        }
        if (indicators.carbon === 7) {
            isaCarbon = 'Neutro = 0 Pontos de Regeneração'
        }
        if (indicators.carbon === 8) {
            isaCarbon = 'Não Regenerativo 1 = -1 Pontos de Regeneração'
        }
        if (indicators.carbon === 9) {
            isaCarbon = 'Não Regenerativo 2 = -2 Pontos de Regeneração'
        }
        if (indicators.carbon === 10) {
            isaCarbon = 'Não Regenerativo 3 = -4 Pontos de Regeneração'
        }
        if (indicators.carbon === 11) {
            isaCarbon = 'Não Regenerativo 4 = -8 Pontos de Regeneração'
        }
        if (indicators.carbon === 12) {
            isaCarbon = 'Não Regenerativo 5 = -16 Pontos de Regeneração'
        }
        if (indicators.carbon === 13) {
            isaCarbon = 'Não Regenerativo 6 = -25 Pontos de Regeneração'
        }
    }

    if (indicators) {
        if (indicators.water === 1) {
            isaWater = 'Regenerativo 6 = +25 Pontos de Regeneração'
        }
        if (indicators.water === 2) {
            isaWater = 'Regenerativo 5 = +16 Pontos de Regeneração'
        }
        if (indicators.water === 3) {
            isaWater = 'Regenerativo 4 = +8 Pontos de Regeneração'
        }
        if (indicators.water === 4) {
            isaWater = 'Regenerativo 3 = +4 Pontos de Regeneração'
        }
        if (indicators.water === 5) {
            isaWater = 'Regenerativo 2 = +2 Pontos de Regeneração'
        }
        if (indicators.water === 6) {
            isaWater = 'Regenerativo 1 = +1 Pontos de Regeneração'
        }
        if (indicators.water === 7) {
            isaWater = 'Neutro = 0 Pontos de Regeneração'
        }
        if (indicators.water === 8) {
            isaWater = 'Não Regenerativo 1 = -1 Pontos de Regeneração'
        }
        if (indicators.water === 9) {
            isaWater = 'Não Regenerativo 2 = -2 Pontos de Regeneração'
        }
        if (indicators.water === 10) {
            isaWater = 'Não Regenerativo 3 = -4 Pontos de Regeneração'
        }
        if (indicators.water === 11) {
            isaWater = 'Não Regenerativo 4 = -8 Pontos de Regeneração'
        }
        if (indicators.water === 12) {
            isaWater = 'Não Regenerativo 5 = -16 Pontos de Regeneração'
        }
        if (indicators.water === 13) {
            isaWater = 'Não Regenerativo 6 = -25 Pontos de Regeneração'
        }
    }

    if (indicators) {
        if (indicators.soil === 1) {
            isaSoil = 'Regenerativo 6 = +25 Pontos de Regeneração'
        }
        if (indicators.soil === 2) {
            isaSoil = 'Regenerativo 5 = +16 Pontos de Regeneração'
        }
        if (indicators.soil === 3) {
            isaSoil = 'Regenerativo 4 = +8 Pontos de Regeneração'
        }
        if (indicators.soil === 4) {
            isaSoil = 'Regenerativo 3 = +4 Pontos de Regeneração'
        }
        if (indicators.soil === 5) {
            isaSoil = 'Regenerativo 2 = +2 Pontos de Regeneração'
        }
        if (indicators.soil === 6) {
            isaSoil = 'Regenerativo 1 = +1 Pontos de Regeneração'
        }
        if (indicators.soil === 7) {
            isaSoil = 'Neutro = 0 Pontos de Regeneração'
        }
        if (indicators.soil === 8) {
            isaSoil = 'Não Regenerativo 1 = -1 Pontos de Regeneração'
        }
        if (indicators.soil === 9) {
            isaSoil = 'Não Regenerativo 2 = -2 Pontos de Regeneração'
        }
        if (indicators.soil === 10) {
            isaSoil = 'Não Regenerativo 3 = -4 Pontos de Regeneração'
        }
        if (indicators.soil === 11) {
            isaSoil = 'Não Regenerativo 4 = -8 Pontos de Regeneração'
        }
        if (indicators.soil === 12) {
            isaSoil = 'Não Regenerativo 5 = -16 Pontos de Regeneração'
        }
        if (indicators.soil === 13) {
            isaSoil = 'Não Regenerativo 6 = -25 Pontos de Regeneração'
        }
    }

    if (indicators) {
        if (indicators.bio === 1) {
            isaBio = 'Regenerativo 6 = +25 Pontos de Regeneração'
        }
        if (indicators.bio === 2) {
            isaBio = 'Regenerativo 5 = +16 Pontos de Regeneração'
        }
        if (indicators.bio === 3) {
            isaBio = 'Regenerativo 4 = +8 Pontos de Regeneração'
        }
        if (indicators.bio === 4) {
            isaBio = 'Regenerativo 3 = +4 Pontos de Regeneração'
        }
        if (indicators.bio === 5) {
            isaBio = 'Regenerativo 2 = +2 Pontos de Regeneração'
        }
        if (indicators.bio === 6) {
            isaBio = 'Regenerativo 1 = +1 Pontos de Regeneração'
        }
        if (indicators.bio === 7) {
            isaBio = 'Neutro = 0 Pontos de Regeneração'
        }
        if (indicators.bio === 8) {
            isaBio = 'Não Regenerativo 1 = -1 Pontos de Regeneração'
        }
        if (indicators.bio === 9) {
            isaBio = 'Não Regenerativo 2 = -2 Pontos de Regeneração'
        }
        if (indicators.bio === 10) {
            isaBio = 'Não Regenerativo 3 = -4 Pontos de Regeneração'
        }
        if (indicators.bio === 11) {
            isaBio = 'Não Regenerativo 4 = -8 Pontos de Regeneração'
        }
        if (indicators.bio === 12) {
            isaBio = 'Não Regenerativo 5 = -16 Pontos de Regeneração'
        }
        if (indicators.bio === 13) {
            isaBio = 'Não Regenerativo 6 = -25 Pontos de Regeneração'
        }
    }

    return {
        content: [
            {
                image: 'data:image/png;base64,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',
                width: 150
            },
            {
                text: [
                    {
                        text: 'Wallet Produtor: ',
                        style: 'label'
                    },
                    `${infoData?.producerWallet}`
                ]
            },
            {
                text: [
                    {
                        text: 'Nome do Produtor: ',
                        style: 'label'
                    },
                    `${infoData?.producerName}`
                ]
            },
            {
                text: [
                    {
                        text: 'Wallet do Inspetor: ',
                        style: 'label'
                    },
                    `${infoData?.inspectorWallet}`
                ]
            },
            {
                text: [
                    {
                        text: 'Área inspecionada: ',
                        style: 'label'
                    },
                    `${infoData?.producerArea} m²`
                ]
            },
            {
                text: [
                    {
                        text: 'Data: ',
                        style: 'label'
                    },
                    `${infoData?.date}`
                ]
            },
            {
                text: [
                    {
                        text: 'Foto de prova: ',
                        style: 'label'
                    },
                    {
                        text: `${inspection.proofPhoto}`,
                        link: `https://app.sintrop.com/view-image/${inspection.proofPhoto}`,
                        style: 'link'
                    }
                ]
            },
            {
                text: `Relatório da Inspeção #${inspection.inspectionId}`,
                style: 'title',
                fillColor: '#c5e0b3'
            },
            {
                text: `Tabela de índices utilizada`,
                style: 'subTitle'
            },
            {
                table: {
                    body: [
                        [{ text: 'Indice', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Unidade', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Carbono', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Água', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Solo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Biodiversidade', style: 'tableHeader', fillColor: '#C5E0B3' }],
                        ...bodyIndices
                    ]
                }
            },
            {
                text: `Tabela de insumos utilizada`,
                style: 'subTitle'
            },
            {
                table: {
                    body: [
                        [{ text: 'Insumo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Unidade', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Carbono', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Água', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Solo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Biodiversidade', style: 'tableHeader', fillColor: '#C5E0B3' }],
                        ...bodyInsumos
                    ]
                }
            },
            {
                text: `Tabela de resíduos utilizada`,
                style: 'subTitle'
            },
            {
                table: {
                    body: [
                        [{ text: 'Insumo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Unidade', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Carbono', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Água', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Solo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Biodiversidade', style: 'tableHeader', fillColor: '#C5E0B3' }],
                        ...bodyResiduos
                    ]
                }
            },
            {
                text: `1) Insumos registrados na propriedade:`,
                style: 'subTitle'
            },
            {
                table: {
                    body: [
                        [{ text: 'Insumo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Resultado', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Unidade', style: 'tableHeader', fillColor: '#C5E0B3' }],
                        ...bodyResultInsumos
                    ]
                }
            },
            {
                text: `2) Cálculo da degradação por uso de insumos e resíduos:`,
                style: 'subTitle'
            },
            {
                table: {
                    body: [
                        [{ text: 'Insumo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Carbono', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Água', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Solo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Biodiversidade', style: 'tableHeader', fillColor: '#C5E0B3' }],
                        ...bodyDegradacao,
                        [{ text: 'Total', style: 'tableHeader' }, { text: `${degenerationCarbon.toFixed(1).replace('.', ',')} kg`, style: 'tableHeader' }, { text: `${degenerationWater.toFixed(1).replace('.', ',')} m³`, style: 'tableHeader' }, { text: `${degenerationSoil.toFixed(1).replace('.', ',')} m²`, style: 'tableHeader' }, { text: `${degenerationBio.toFixed(1).replace('.', ',')} uv`, style: 'tableHeader' }],
                    ]
                }
            },
            {
                text: `3) Zonas de Regeneração:`,
                style: 'subTitle'
            },
            {
                text: `Coordenadas das zonas:`,
                style: 'label'
            },
            {
                table: {
                    body: [
                        [{ text: 'Nome', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Coordenadas', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Área [m²]', style: 'tableHeader', fillColor: '#C5E0B3' }],
                        ...bodyCoordsZonesTeste
                    ]
                },
                style: 'table'
            },
            {
                text: `Fotos das zonas:`,
                style: 'label'
            },
            {
                table: {
                    body: [
                        [{ text: 'Zona', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Foto', style: 'tableHeader', fillColor: '#C5E0B3' }],
                        ...rowPhotosZone
                    ]
                },
                style: 'table'
            },
            {
                text: `Estimativa de biomassa no solo`,
                style: 'label'
            },
            {
                table: {
                    body: [
                        [{ text: 'Zona', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Área da zona [m²]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Ponto 1 [kg]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Ponto 2 [kg]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Ponto 3 [kg]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Ponto 4 [kg]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Área da amostra [m²]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Biomassa úmida?', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Cálculo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Total [kg]', style: 'tableHeader', fillColor: '#C5E0B3' }],
                        ...bodyAnaliseSoloZones,
                        [{ text: 'Total', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: `${saldoCarbonAnaliseSoloZones.toFixed(2).replace('.', ',')}`, style: 'tableHeader' }],
                    ]
                }
            },
            {
                text: `-Cálculo da biomassa no solo:`,
                style: 'titleExplic'
            },
            {
                text: `Total = ((Média dos pontos x Área da zona) / Área da amostra) x Indice da análise de solo`,
                italics: true,
                color: '#0a4303'
            },
            {
                text: `Caso seja assinalado o solo úmido, o resultado da fórmula acima, é multiplicado pelo indice do fator de umidade`,
                style: 'explicacaoCalc'
            },
            {
                text: `Plantas registradas nas zonas`,
                style: 'label'
            },
            {
                table: {
                    body: [
                        [{ text: 'Zona', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Coordenada', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Diâmetro [cm]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Altura [m]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Foto', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Volume [m³]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Amostragem', style: 'tableHeader', fillColor: '#C5E0B3' }],
                        ...bodySampling1
                    ]
                }
            },
            {
                text: `-Cálculo do volume de biomassa das árvores:`,
                style: 'titleExplic'
            },
            {
                text: `Volume = (π x r² x altura) x Índice multiplicador da raiz`,
                style: 'explicacaoCalc'
            },
            {
                text: `Quantidade total de plantas`,
                style: 'label'
            },
            {
                table: {
                    headerRows: 1,
                    body: [
                        [{ text: 'Zona', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Área da zona [m²]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Plantas registradas', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Área total das amostragens [m²]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Cálculo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Total estimado', style: 'tableHeader', fillColor: '#C5E0B3' }],
                        ...bodyEstimatedTrees,
                        [{ text: 'Total', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: `${estimatedTreesTotal}`, style: 'tableHeader' }],
                    ]
                }
            },
            {
                text: `-Cálculo da estimativa de plantas:`,
                style: 'titleExplic'
            },
            {
                text: `Total = Área da zona x (Total de plantas registrados / Área total das amostragens da zona)`,
                style: 'explicacaoCalc'
            },
            {
                text: `Volume estimado de biomassa das zonas`,
                style: 'label'
            },
            {
                table: {
                    headerRows: 1,
                    body: [
                        [{ text: 'Zona', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Área da zona [m²]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Volume total da amostra [m³]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Área total da amostra [m²]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Cálculo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Resultado [m³]', style: 'tableHeader', fillColor: '#C5E0B3' }],
                        ...bodyVolumeZones,
                        [{ text: 'Total', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: `${volumeTotalZonas.toFixed(4).replace('.', ',')}`, style: 'tableHeader' }],
                    ]
                }
            },
            {
                text: `-Fórmula da extrapolação do volume de biomassa da amostra para a zona`,
                style: 'titleExplic'
            },
            {
                text: `Volume da zona = Área da zona x (Volume total da amostra / Área total da amostra)`,
                style: 'explicacaoCalc'
            },
            {
                text: `Água estocada nas zonas`,
                style: 'label'
            },
            {
                table: {
                    body: [
                        [{ text: 'Zona', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Volume da zona [m³]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Cálculo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Resultado [m³]', style: 'tableHeader', fillColor: '#C5E0B3' }],
                        ...bodyAguaEstocada,
                        [{ text: 'Total', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: `${totalAguaEstocadaZones.toFixed(2).replace('.', ',')}`, style: 'tableHeader' }],
                    ]
                },
            },
            {
                text: `-Cálculo da água estocada:`,
                style: 'titleExplic'
            },
            {
                text: `Água estocada = Volume da zona x Índice da porcentagem de água na biomassa`,
                style: 'explicacaoCalc'
            },
            {
                text: `Carbono estocado nas zonas`,
                style: 'label'
            },
            {
                table: {
                    body: [
                        [{ text: 'Zona', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Volume da zona [m³]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Água estocada [m³]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Biomassa seca', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Cálculo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Resultado [t]', style: 'tableHeader', fillColor: '#C5E0B3' }],
                        ...bodyCarbonoEstocado,
                        [{ text: 'Total', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, { text: `${totalCarbonEstocadoZones.toFixed(2).replace('.', ',')}`, style: 'tableHeader' }],
                    ]
                }
            },
            {
                text: `-Cálculo do carbono estocado:`,
                style: 'titleExplic'
            },
            {
                text: `Carbono estocado = *Biomassa seca x Índice da porcentagem de carbono na biomassa seca`,
                style: 'explicacaoCalc'
            },
            {
                text: `*Biomassa Seca = Volume da zona - Água estocada`,
                style: 'explicacaoCalc'
            },
            {
                text: `4) Registro de Biodiversidade:`,
                style: 'subTitle'
            },
            {
                table: {
                    body: [
                        [{ text: 'Tipo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Biodiversidade registrada', style: 'tableHeader', fillColor: '#C5E0B3' }],
                        ...bodyBio
                    ]
                }
            },
            {
                text: `Biodiversidade registrada nas zonas`,
                style: 'label'
            },
            {
                table: {
                    body: [
                        [{ text: 'Zona', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Foto', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Tipo', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Espécie', style: 'tableHeader', fillColor: '#C5E0B3' }],
                        ...rowAnaliseBio
                    ]
                }
            },
            {
                text: `Biodiversidade do solo registrado nas zonas`,
                style: 'label'
            },
            {
                table: {
                    body: [
                        [{ text: 'Zona', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Coordenada', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Foto', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Registro', style: 'tableHeader', fillColor: '#C5E0B3' }],
                        ...bodySoilBioPhoto
                    ]
                }
            },
            {
                text: `Nascentes dentro da propriedade:`,
                style: 'label'
            },
            {
                table: {
                    body: [
                        [{ text: 'Geolocalização', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Foto', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Fluxo de água', style: 'tableHeader', fillColor: '#C5E0B3' }],
                        ...bodySprings
                    ]
                }
            },
            {
                text: `5) Resultado Final:`,
                style: 'subTitle'
            },
            {
                table: {
                    body: [
                        [{ text: '', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Carbono [kg]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Água [m³]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Solo [m²]', style: 'tableHeader', fillColor: '#C5E0B3' }, { text: 'Biodiversidade [uv]', style: 'tableHeader', fillColor: '#C5E0B3' }],
                        ['Insumos', `${degenerationCarbon.toFixed(2).replace('.', ',')}`, `${degenerationWater.toFixed(2).replace('.', ',')}`, `${degenerationSoil.toFixed(2).replace('.', ',')}`, `${degenerationBio.toFixed(0)}`],
                        ['Árvores', `${((totalCarbonEstocadoZones * -1) * 1000).toFixed(2).replace('.', ',')}`, `${totalAguaEstocadaZones.toFixed(2).replace('.', ',')}`, `0`, `0`],
                        ['Análise de Solo', `${saldoCarbonAnaliseSoloZones.toFixed(2).replace('.', ',')}`, `0`, `${saldoSoilAnaliseSoloZones.toFixed(2).replace('.', ',')}`, `0`],
                        ['Biodiversidade', '0', '0', '0', `${(totalSoilBio + totalBioZones).toFixed(0)}`],
                        ['Nascentes', '0', `${Number(totalWaterSprings).toFixed(2)}`, '0', `0`],
                        [
                            { text: 'Total', style: 'tableHeader' },
                            { text: `${(degenerationCarbon + saldoCarbonAnaliseSoloZones + ((totalCarbonEstocadoZones * -1) * 1000)).toFixed(2).replace('.', ',')}`, style: 'tableHeader' },
                            { text: `${(degenerationWater + totalAguaEstocadaZones + totalWaterSprings).toFixed(2).replace('.', ',')}`, style: 'tableHeader' },
                            { text: `${(degenerationSoil + saldoSoilAnaliseSoloZones).toFixed(2).replace('.', ',')}`, style: 'tableHeader' },
                            { text: `${(degenerationBio + totalSoilBio + totalBioZones).toFixed(0)}`, style: 'tableHeader' },
                        ]
                    ]
                },
                style: 'table'
            },
            {
                text: `Resultado Registrado na Blockchain:`,
                style: 'label'
            },
            {
                text: [
                    {
                        text: 'Carbono: ',
                        style: 'label'
                    },
                    `${Number(resultIndices?.carbon).toFixed(2).replace('.', ',')} kg = ${isaCarbon}`
                ]
            },
            {
                text: [
                    {
                        text: 'Água: ',
                        style: 'label'
                    },
                    `${Number(resultIndices?.water).toFixed(2).replace('.', ',')} m³ = ${isaWater}`
                ]
            },
            {
                text: [
                    {
                        text: 'Solo: ',
                        style: 'label'
                    },
                    `${Number(resultIndices?.soil).toFixed(2).replace('.', ',')} m² = ${isaSoil}`
                ]
            },
            {
                text: [
                    {
                        text: 'Biodiversidade: ',
                        style: 'label'
                    },
                    `${Number(resultIndices?.bio).toFixed(0)} uv = ${isaBio}`
                ]
            },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                marginBottom: 5
            },
            subheader: {
                fontSize: 15,
                bold: true,
                marginBottom: 15
            },
            title: {
                color: '#0a4303',
                textAlign: 'center',
                bold: true,
                fontSize: 22,
                marginTop: 15,
                backgroundColor: 'green'
            },
            subTitle: {
                color: '#0a4303',
                textAlign: 'center',
                bold: true,
                fontSize: 14,
                marginTop: 15,
                marginBottom: 5
            },
            blackBold: {
                bold: true,
                marginTop: 10
            },
            label: {
                bold: true,
                color: '#0a4303',
                marginTop: 5,
                marginBottom: 5
            },
            link: {
                color: 'blue',
                marginBottom: 5
            },
            explicacaoCalc: {
                marginBottom: 10,
                italics: true,
                color: '#0a4303'
            },
            titleExplic: {
                color: '#0a4303',
                italics: true
            },
            tableHeader: {
                bold: true
            },
            table: {
                marginBottom: 10
            }
        }
    }
}

interface AfterRealizeInspectionProps{
    transactionId: string;
    transactionHash: string;
    walletConnected: string;
    inspectionId: string;
    producerWallet?: string;
}
async function afterRealizeInspection(props: AfterRealizeInspectionProps){
    const {transactionId, transactionHash, walletConnected, inspectionId, producerWallet} = props;

    await finishTransaction(transactionId, transactionHash);
    await createPubliFeed({
        walletConnected,
        type: 'realize-inspection',
        additionalData: JSON.stringify({
            inspectionId: inspectionId,
            hash: transactionHash
        })
    });
    if(producerWallet){
        await attNetworkImpact(producerWallet);
    }
}

async function attNetworkImpact(producerWallet: string) {
    try{
        await api.put('/impact-user', {
            producerWallet
        });
    }catch(e){
        console.log(e);
    }

    try{
        await api.get('/new-network-impact');
    }catch(e){
        console.log(e)
    }
}