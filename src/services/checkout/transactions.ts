import { TransactionCheckoutProps } from "../../interfaces/transactionsCheckout";
import { api } from "../api";

interface ReturnGetTransactionsCheckoutProps{
    success: boolean;
    openTransactions: TransactionCheckoutProps[];
    finishedTransactions: TransactionCheckoutProps[];
    message?: string;
}
export async function getTransactionsCheckout(wallet: string): Promise<ReturnGetTransactionsCheckoutProps>{
    try{
        const response = await api.get(`/transactions-checkout/${wallet}`);
        const {openTransactions, finishedTransactions} = response.data;

        return{
            success: true,
            openTransactions,
            finishedTransactions,
            message: 'success'
        }
    }catch(e){
        return{
            success: false,
            openTransactions: [],
            finishedTransactions: [],
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