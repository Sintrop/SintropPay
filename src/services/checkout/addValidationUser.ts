import { TransactionCheckoutProps } from "../../interfaces/transactionsCheckout";
import { ReturnTransactionProps } from "../web3/V7/RCToken";
import { addValidation } from "../web3/V7/Validator";

interface AdditionalDataAddValidationProps{
    justification: string;
    userToVote: string;
}

interface ExecuteAddValidationProps {
    transactionCheckoutData: TransactionCheckoutProps;
    walletConnected: string;
}
export async function executeAddValidation(props: ExecuteAddValidationProps): Promise<ReturnTransactionProps>{
    const {transactionCheckoutData, walletConnected} = props;

    let additionalData = {} as AdditionalDataAddValidationProps;
    if(transactionCheckoutData.additionalData){
        additionalData = JSON.parse(transactionCheckoutData.additionalData);
    }
    const responseWeb3 = await addValidation({
        walletConnected,
        justification: additionalData.justification,
        walletToVote: ''    
    });

    return responseWeb3;
}