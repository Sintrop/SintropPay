import { SintropContract } from "./Contracts";
import { web3RequestWrite } from "../requestService";
import { ReturnTransactionProps } from "./RCToken";

interface RequestInspectionProps{
    walletConnected: string;
}
export async function requestInspection(props: RequestInspectionProps): Promise<ReturnTransactionProps>{
    const {walletConnected} = props;
    const response = await web3RequestWrite(SintropContract, 'requestInspection', [], walletConnected);
    return response
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