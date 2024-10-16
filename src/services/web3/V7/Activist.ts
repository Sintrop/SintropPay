import { ActivistContract } from "./Contracts";
import { web3RequestWrite } from "../requestService";
import { ReturnTransactionProps } from "./RCToken";

interface AddActivistProps{
    walletConnected: string;
    name: string;
    proofPhoto: string;
}
export async function addActivist(props: AddActivistProps): Promise<ReturnTransactionProps>{
    const {name, proofPhoto, walletConnected} = props;
    const response = await web3RequestWrite(ActivistContract, 'addActivist', [name, proofPhoto], walletConnected);
    return response;
}

export async function withdraw(walletConnected: string): Promise<ReturnTransactionProps>{
    const response = await web3RequestWrite(ActivistContract, 'withdraw', [], walletConnected);
    return response;
}