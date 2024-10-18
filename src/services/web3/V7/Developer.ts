import { DeveloperContract } from "./Contracts";
import { web3RequestWrite } from "../requestService";
import { ReturnTransactionProps } from "./RCToken";

interface AddDeveloperProps{
    walletConnected: string;
    name: string;
    proofPhoto: string;
}
export async function addDeveloper(props: AddDeveloperProps): Promise<ReturnTransactionProps>{
    const {name, proofPhoto, walletConnected} = props;
    const response = await web3RequestWrite(DeveloperContract, 'addDeveloper', [name, proofPhoto], walletConnected);
    return response;
}

export async function withdraw(walletConnected: string): Promise<ReturnTransactionProps>{
    const response = await web3RequestWrite(DeveloperContract, 'withdraw', [], walletConnected);
    return response;
}