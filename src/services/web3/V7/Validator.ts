import { web3RequestWrite } from "../requestService";
import { ValidatorContract } from "./Contracts";
import { ReturnTransactionProps } from "./RCToken";

export async function addValidator(walletConnected: string): Promise<ReturnTransactionProps>{
    const response = await web3RequestWrite(ValidatorContract, 'addValidator', [], walletConnected);
    return response;
}

export async function withdraw(walletConnected: string): Promise<ReturnTransactionProps>{
    const response = await web3RequestWrite(ValidatorContract, 'withdraw', [], walletConnected);
    return response;
}

interface AddValidationProps{
    walletConnected: string;
    walletToVote: string;
    justification: string;
}
export async function addValidation(props: AddValidationProps): Promise<ReturnTransactionProps>{
    const {justification, walletConnected, walletToVote} = props;
    const response = await web3RequestWrite(ValidatorContract, 'addValidation', [walletToVote, justification], walletConnected);
    return response;
}