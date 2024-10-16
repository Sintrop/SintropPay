import { TransactionCheckoutProps } from "../../interfaces/transactionsCheckout";
import { api } from "../api";

interface ReturnGetTransactionsCheckoutProps{
    success: boolean;
    transactions: TransactionCheckoutProps[];
    message?: string;
}
export async function getTransactionsCheckout(wallet: string): Promise<ReturnGetTransactionsCheckoutProps>{
    try{
        const response = await api.get(`/transactions-open/${wallet}`);
        return{
            success: true,
            transactions: response.data.transactions,
            message: 'error'
        }
    }catch(e){
        return{
            success: false,
            transactions: [],
            message: 'error'
        }
    }
}

export async function finishTransaction(transactionId: string){
    try{
        await api.put('/transactions-open/finish', { id: transactionId });
    }catch(e){

    }
}