import { ProducerContract } from "./Contracts";
import { web3RequestWrite } from "../requestService";
import { ReturnTransactionProps } from "./RCToken";

export async function withdraw(walletConnected: string): Promise<ReturnTransactionProps>{
    const response = await web3RequestWrite(ProducerContract, 'withdraw', [], walletConnected);
    return response;
}