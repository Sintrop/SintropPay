import { InspectorContract } from "./Contracts";
import { web3RequestWrite } from "../requestService";
import { ReturnTransactionProps } from "./RCToken";

interface AddInspectorProps{
    walletConnected: string;
    name: string;
    proofPhoto: string;
}
export async function addInspector(props: AddInspectorProps): Promise<ReturnTransactionProps>{
    const {name, proofPhoto, walletConnected} = props;
    const response = await web3RequestWrite(InspectorContract, 'addInspector', [name, proofPhoto], walletConnected);
    return response;
}

export async function withdraw(walletConnected: string): Promise<ReturnTransactionProps>{
    const response = await web3RequestWrite(InspectorContract, 'withdraw', [], walletConnected);
    return response;
}