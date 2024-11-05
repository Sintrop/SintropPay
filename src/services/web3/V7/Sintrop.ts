import { SintropContract, sintropContractAddress } from "./Contracts";
import { web3RequestWrite } from "../requestService";
import { ReturnTransactionProps } from "./RCToken";
import { InspectionWeb3Props } from "@/interfaces/inspection";
import { IsaProps } from "@/services/checkout/realizeInspection";

interface RequestInspectionProps{
    walletConnected: string;
}
export async function requestInspection(props: RequestInspectionProps): Promise<ReturnTransactionProps>{
    const {walletConnected} = props;
    const response = await web3RequestWrite(SintropContract, 'requestInspection', [], walletConnected);
    return response
}

interface AcceptInspectionProps{
    inspectionId: number,
    walletConnected: string;
}
export async function acceptInspection(props: AcceptInspectionProps): Promise<ReturnTransactionProps>{
    const {inspectionId, walletConnected} = props;
    const response = await web3RequestWrite(SintropContract, 'acceptInspection', [inspectionId], walletConnected);
    return response;
}

interface RealizeInspectionProps{
    inspectionId: string;
    proofPhoto: string;
    report: string;
    isas: IsaProps[];
    walletConnected: string;
}
export async function realizeInspection(props: RealizeInspectionProps): Promise<ReturnTransactionProps>{
    const {inspectionId, isas, proofPhoto, report, walletConnected} = props;
    const response = await web3RequestWrite(SintropContract, 'realizeInspection', [inspectionId, proofPhoto, report, isas], walletConnected);
    return response;
}

interface AddInspectionValidationProps{
    inspectionId: number;
    justification: string;
    walletConnected: string;
}
export async function addInspectionValidation(props: AddInspectionValidationProps): Promise<ReturnTransactionProps>{
    const {inspectionId, justification, walletConnected} = props;
    const response = await web3RequestWrite(SintropContract, 'addInspectionValidation', [inspectionId, justification], walletConnected);
    return response;
}

export async function getInspection(inspectionId: string){
    let inspectionData = {} as InspectionWeb3Props;
    const inspection = await SintropContract.methods.getInspection(inspectionId).call({ from: sintropContractAddress });
    if(inspection){
        inspectionData = inspection as any;
    }
    
    const data = {
        id: Number(String(inspectionData?.id).replace('n', '')),
        status: Number(String(inspectionData?.status).replace('n', '')),
        producer: inspectionData?.producer,
        inspector: inspectionData?.inspector,
        isaScore: Number(String(inspectionData?.isaScore).replace('n', '')),
        proofPhoto: inspectionData?.proofPhoto,
        report: inspectionData?.report,
        validationsCount: Number(String(inspectionData?.validationsCount).replace('n', '')),
        createdAt: Number(String(inspectionData?.createdAt).replace('n', '')),
        acceptedAt: Number(String(inspectionData?.acceptedAt).replace('n', '')),
        inspectedAt: Number(String(inspectionData?.inspectedAt).replace('n', '')),
        inspectedAtEra: Number(String(inspectionData?.inspectedAtEra).replace('n', '')),
        invalidatedAt: Number(String(inspectionData?.invalidatedAt).replace('n', ''))
    }

    return data
}