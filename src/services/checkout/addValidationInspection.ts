import { InspectionWeb3Props } from "../../interfaces/inspection";
import { TransactionCheckoutProps } from "../../interfaces/transactionsCheckout";
import { ReturnTransactionProps } from "../web3/V7/RCToken";
import { addInspectionValidation } from "../web3/V7/Sintrop";
import { createPubliFeed } from "./publicationFeed";
import { finishTransaction } from "./transactions";

interface AdditionalDataAddInspectionValidationProps{
    justification: string;
    inspection: InspectionWeb3Props;
}

interface ExecuteAddValidationInspectionProps {
    transactionCheckoutData: TransactionCheckoutProps;
    walletConnected: string;
}
export async function executeAddValidationInspection(props: ExecuteAddValidationInspectionProps): Promise<ReturnTransactionProps>{
    const {transactionCheckoutData, walletConnected} = props;

    let additionalData = {} as AdditionalDataAddInspectionValidationProps;
    if(transactionCheckoutData.additionalData){
        additionalData = JSON.parse(transactionCheckoutData.additionalData);
    }
    
    const response = await addInspectionValidation({
        inspectionId: additionalData.inspection.id,
        justification: additionalData.justification,
        walletConnected
    });

    if(response.success){
        await afterAddValidation({
            additionalData,
            transactionHash: response.transactionHash,
            transactionId: transactionCheckoutData.id,
            walletConnected
        })

        return response;
    }

    return response;
}

interface AfterAddValidationProps{
    walletConnected: string;
    transactionId: string;
    transactionHash: string;
    additionalData: AdditionalDataAddInspectionValidationProps
}
async function afterAddValidation(props: AfterAddValidationProps){
    const {transactionId, walletConnected, transactionHash, additionalData} = props;

    await finishTransaction(transactionId, transactionHash);
    await createPubliFeed({
        type: 'vote-invalidate-inspection',
        walletConnected,
        additionalData: JSON.stringify({
            ...additionalData,
            hash: transactionHash
        })
    })
}