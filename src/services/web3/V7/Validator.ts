import { web3RequestWrite } from "../requestService";
import { ValidatorContract } from "./Contracts";
import { ReturnTransactionProps } from "./RCToken";

export async function addValidator(walletConnected: string): Promise<ReturnTransactionProps>{
    const response = await web3RequestWrite(ValidatorContract, 'addValidator', [], walletConnected);
    return response;
}