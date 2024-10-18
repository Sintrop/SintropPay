import { TransactionCheckoutProps } from "../../interfaces/transactionsCheckout";
import { ReturnTransactionProps } from "../web3/V7/RCToken";
import { requestInspection } from "../web3/V7/Sintrop";
import { createPubliFeed } from "./publicationFeed";
import { finishTransaction } from "./transactions";

interface ExecuteRequestInspectionProps {
    transactionCheckoutData: TransactionCheckoutProps;
    walletConnected: string;
}

export async function executeRequestInspection(props: ExecuteRequestInspectionProps): Promise<ReturnTransactionProps>{
    const {walletConnected, transactionCheckoutData} = props;
    const responseWeb3 = await requestInspection({walletConnected});
    
    if(responseWeb3.success){
        await finishTransaction(transactionCheckoutData.id, responseWeb3.transactionHash);
        await createPubliFeed({
            type: 'request-inspection',
            additionalData: JSON.stringify({hash: responseWeb3.transactionHash}),
            walletConnected
        });
        
        return responseWeb3;
    }

    return responseWeb3;
}