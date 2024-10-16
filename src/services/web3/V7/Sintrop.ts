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