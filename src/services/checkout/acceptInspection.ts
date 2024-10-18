import { ZoneProps } from "../../interfaces/inspection";
import { TransactionCheckoutProps } from "../../interfaces/transactionsCheckout";
import { api } from "../api";
import { getProducer } from "../web3/V7/Producer";
import { ReturnTransactionProps } from "../web3/V7/RCToken";
import { acceptInspection } from "../web3/V7/Sintrop";
import { createPubliFeed } from "./publicationFeed";
import { finishTransaction } from "./transactions";
import { getUserApi } from "./userApi";

interface AdditionalDataAcceptInspectionProps {
    inspectionId: number;
    createdBy: string;
    createdAt: string;
    addressProducer: string;
}

interface ExecuteAcceptInspectionProps {
    transactionCheckoutData: TransactionCheckoutProps;
    walletConnected: string;
}
export async function executeAcceptInspection(props: ExecuteAcceptInspectionProps): Promise<ReturnTransactionProps> {
    const { transactionCheckoutData, walletConnected } = props;

    let additionalData = {} as AdditionalDataAcceptInspectionProps;
    if (transactionCheckoutData.additionalData) {
        additionalData = JSON.parse(transactionCheckoutData.additionalData);
    }

    const response = await acceptInspection({
        walletConnected,
        inspectionId: additionalData.inspectionId,
    });

    if (response.success) {
        await afterAcceptInspection({
            additionalData, 
            walletConnected,
            transactionId: transactionCheckoutData.id,
            transactionHash: response.transactionHash,
        });
        return response;
    }

    return response;
}

interface AfterAcceptInspection {
    walletConnected: string;
    additionalData: AdditionalDataAcceptInspectionProps;
    transactionId: string;
    transactionHash: string;
}
async function afterAcceptInspection(props: AfterAcceptInspection) {
    const { walletConnected, additionalData, transactionId, transactionHash } = props;

    await registerInspectionAPI({additionalData, walletConnected})
    await finishTransaction(transactionId, transactionHash);
    await createPubliFeed({
        type: 'accept-inspection',
        walletConnected,
        additionalData: JSON.stringify({
            hash: transactionHash,
            inspectionId: additionalData?.inspectionId,
        })
    });
}

interface RegisterInspectionApiProps{
    additionalData: AdditionalDataAcceptInspectionProps;
    walletConnected: string;
}
async function registerInspectionAPI(props: RegisterInspectionApiProps) {
    const { additionalData, walletConnected } = props;
    const resProducer = await getUserApi(additionalData?.createdBy)
    const producerDataApi = resProducer.user;
    const producerData = await getProducer(additionalData?.createdBy)

    const producer = {
        name: producerData?.name,
        totalInspections: producerData?.totalInspections,
        pendingInspection: producerData?.pendingInspection,
        propertyAddress: JSON.parse(producerDataApi?.address),
        propertyArea: producerData?.areaInformation?.totalArea,
        propertyGeolocation: producerDataApi?.propertyGeolocation,
        proofPhoto: producerDataApi?.imgProfileUrl,
        producerWallet: producerData?.producerWallet,
        pool: {
            currentEra: producerData?.pool?.currentEra
        },
        lastRequestAt: producerData?.lastRequestAt,
        isa: {
            isaAverage: producerData?.isa?.isaAverage,
            isaScore: producerData?.isa?.isaScore,
            sustainable: producerData?.isa?.sustainable
        }
    }

    const propertyData = JSON.stringify(producer);

    const zones = JSON.parse(producerDataApi?.zones) as ZoneProps[];

    let pointsSortedZones = [];
    for (var i = 0; i < zones.length; i++) {
        const pointsToSort = zones[i]?.pointsToSort;

        const sortAnaliseBiomass1 = parseInt(String(Math.random() * Number(pointsToSort.length) - 1));
        const sortAnaliseBiomass2 = parseInt(String(Math.random() * Number(pointsToSort.length) - 1));
        const sortAnaliseBiomass3 = parseInt(String(Math.random() * Number(pointsToSort.length) - 1));
        const sortAnaliseBiomass4 = parseInt(String(Math.random() * Number(pointsToSort.length) - 1));
        const sortAnaliseBioSoil1 = parseInt(String(Math.random() * Number(pointsToSort.length) - 1));
        const sortAnaliseBioSoil2 = parseInt(String(Math.random() * Number(pointsToSort.length) - 1));
        const sortAnaliseBioSoil3 = parseInt(String(Math.random() * Number(pointsToSort.length) - 1));
        const sortAnaliseBioSoil4 = parseInt(String(Math.random() * Number(pointsToSort.length) - 1));
        const sortAnaliseTrees = parseInt(String(Math.random() * Number(pointsToSort.length) - 1));
        const sortAnaliseAudio = parseInt(String(Math.random() * Number(pointsToSort.length) - 1));
        const sortAnaliseBio = parseInt(String(Math.random() * Number(pointsToSort.length) - 1));

        let data = {
            title: zones[i].title,
            analiseBiomass1: pointsToSort[sortAnaliseBiomass1],
            analiseBiomass2: pointsToSort[sortAnaliseBiomass2],
            analiseBiomass3: pointsToSort[sortAnaliseBiomass3],
            analiseBiomass4: pointsToSort[sortAnaliseBiomass4],
            analiseBioSoil1: pointsToSort[sortAnaliseBioSoil1],
            analiseBioSoil2: pointsToSort[sortAnaliseBioSoil2],
            analiseBioSoil3: pointsToSort[sortAnaliseBioSoil3],
            analiseBioSoil4: pointsToSort[sortAnaliseBioSoil4],
            analiseTree: pointsToSort[sortAnaliseTrees],
            analiseAudio: pointsToSort[sortAnaliseAudio],
            analiseBio: pointsToSort[sortAnaliseBio],
        }

        pointsSortedZones.push(data);
    }

    const addData = {
        coordsToAnalise: pointsSortedZones
    }

    try {
        await api.post('/inspections', {
            inspectionId: String(additionalData?.inspectionId),
            createdBy: String(additionalData?.createdBy),
            createdAt: '',
            userWallet: String(walletConnected).toUpperCase(),
            propertyData,
            zones: producerDataApi?.zones,
            additionalData: JSON.stringify(addData),
        })
    } catch (err) {
        console.log(err);
    }
}