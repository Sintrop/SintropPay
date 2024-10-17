import { ProducerContract } from "./Contracts";
import { web3RequestWrite } from "../requestService";
import { ReturnTransactionProps } from "./RCToken";
import { ProducerProps } from "../../../interfaces/user";

export async function withdraw(walletConnected: string): Promise<ReturnTransactionProps>{
    const response = await web3RequestWrite(ProducerContract, 'withdraw', [], walletConnected);
    return response;
}

interface AddProducerProps{
    walletConnected: string;
    totalArea: number;
    name: string;
    proofPhoto: string;
    reportAddress: string;
}
export async function addProducer(props: AddProducerProps): Promise<ReturnTransactionProps>{
    const {name, proofPhoto, reportAddress, totalArea, walletConnected} = props;
    const response = await web3RequestWrite(ProducerContract, 'addProducer', [totalArea, name, proofPhoto, reportAddress], walletConnected);
    return response;
}

export async function getProducer(wallet: string){
    let producer = {} as ProducerProps;
    const producerResponseWeb3 = await ProducerContract.methods.getProducer(wallet).call();
    if(producerResponseWeb3){
        producer = producerResponseWeb3 as any;
    }

    const data = {
        id: Number(String(producer?.id).replace('n', '')),
        producerWallet: producer?.producerWallet,
        name: producer?.name,
        proofPhoto: producer?.proofPhoto,
        pendingInspection: producer?.pendingInspection,
        totalInspections: Number(String(producer?.totalInspections).replace('n', '')),
        lastRequestAt: Number(String(producer?.lastRequestAt).replace('n', '')),
        isa: {
            isaScore: Number(String(producer?.isa?.isaScore).replace('n', '')),
            isaAverage: Number(String(producer?.isa?.isaAverage).replace('n', '')),
            sustainable: producer?.isa?.sustainable
        },
        areaInformation: {
            coordinates: producer?.areaInformation?.coordinates,
            totalArea: Number(String(producer?.areaInformation?.totalArea).replace('n', '')),
        },
        pool: {
            currentEra: Number(String(producer?.pool?.currentEra).replace('n', '')),
            onContractPool: producer?.pool?.onContractPool
        }
    }

    return data;
}