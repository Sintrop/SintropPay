import { toast } from "react-toastify";
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

export async function finishTransaction(transactionId: string, transactionHash: string){
    try{
        await api.put('/transactions-open/finish', { id: transactionId, transactionHash });
    }catch(e){

    }
}

interface ReturnDiscardTransaction{
    success: boolean;
}
export async function discardTransaction(transactionId: string): Promise<ReturnDiscardTransaction>{
    try{
        await api.put('/transaction-open/discard', {
            transactionId,
        });
        toast.success('Transação descartada com sucesso!');
        return {
            success: true,
        }
    }catch(e){
        toast.error('Erro ao tentar descartar a transação!')
        return{
            success: false
        }
    }
}