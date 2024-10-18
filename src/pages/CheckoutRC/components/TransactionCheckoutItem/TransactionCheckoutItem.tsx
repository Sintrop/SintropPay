import { useState } from "react";
import { TransactionCheckoutProps } from "../../../../interfaces/transactionsCheckout"
import { LoadingTransaction } from "../../../../components/LoadingTransaction/LoadingTransaction";
import { toast } from "react-toastify";
import { format } from "date-fns";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { discardTransaction } from "@/services/checkout/transactions";

interface Props {
    transaction: TransactionCheckoutProps;
    reloadTransactions: () => void;
}
export function TransactionCheckoutItem({ transaction, reloadTransactions }: Props) {
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    const [loadingDiscard, setLoadingDiscard] = useState(false);

    async function handleFinishTransaction() {
        if (transaction?.type === 'register') {
            setLoadingTransaction(true);
        }
        if (transaction?.type === 'accept-inspection') {
            setLoadingTransaction(true);
        }
        if (transaction?.type === 'realize-inspection') {
            //finishNewVersion();
        }
        if (transaction?.type === 'request-inspection') {
            setLoadingTransaction(true);
        }
        if (transaction?.type === 'buy-tokens') {
            //buyTokens();
        }
        if (transaction?.type === 'burn-tokens') {
            setLoadingTransaction(true);
        }
        if (transaction?.type === 'invalidate-inspection') {
            setLoadingTransaction(true);
        }
        if (transaction?.type === 'dev-report') {
            //sendDevReport();
        }
        if (transaction?.type === 'withdraw-tokens') {
            setLoadingTransaction(true);
        }
        if (transaction?.type === 'invalidate-user') {
            //invalidateUser();
        }
        if (transaction?.type === 'invite-user') {
            setLoadingTransaction(true);
        }
    }

    async function handleDiscardTransaction(){
        if(loadingDiscard)return;

        setLoadingDiscard(true);

        const response = await discardTransaction(transaction.id);
        if(response.success){
            reloadTransactions();
        }

        setLoadingDiscard(false);
    }

    function transactionSuccess() {
        toast.success('Transação realizada com sucesso!');
        setLoadingTransaction(false);
        reloadTransactions();
    }

    if (transaction.finished) {
        return (
            <div className="w-full flex flex-col justify-between rounded-md bg-container-secondary p-3">
                <p className="text-white">
                    Tipo da transação:
                    <span className="font-bold ml-2">
                        {transaction?.type === 'register' && 'Cadastro'}
                        {transaction?.type === 'request-inspection' && 'Solicitação de inspeção'}
                        {transaction?.type === 'accept-inspection' && 'Aceitar inspeção'}
                        {transaction?.type === 'realize-inspection' && 'Finalizar inspeção'}
                        {transaction?.type === 'buy-tokens' && 'Compra de RC'}
                        {transaction?.type === 'burn-tokens' && 'Contribuição'}
                        {transaction?.type === 'invalidate-inspection' && 'Invalidar inspeção'}
                        {transaction?.type === 'dev-report' && 'Relatório de contribuição'}
                        {transaction?.type === 'withdraw-tokens' && 'Sacar tokens'}
                        {transaction?.type === 'invalidate-user' && 'Invalidar usuário'}
                        {transaction?.type === 'invite-user' && 'Convidar usuário'}
                    </span>
                </p>

                {transaction.discarded ? (
                    <p className="text-yellow-500 mt-5">Essa transação foi descartada</p>
                ) : (
                    <>
                        <p className="text-white mt-5">
                            Finalizada em:
                            <span className="font-bold ml-2">
                                {transaction.finishedAt && (
                                    format(transaction.finishedAt, 'dd/MM/yyyy - kk:mm')
                                )}
                            </span>
                        </p>

                        {transaction.transactionHash && (
                            <p className="text-white mt-1">
                                Hash da transação:
                                <span className="font-bold ml-2">
                                    {transaction.transactionHash}
                                </span>
                            </p>
                        )}
                    </>
                )}
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col justify-between rounded-md bg-container-primary p-3 h-[170px]">
            <p className="text-white">
                Tipo da transação:
                <span className="font-bold ml-2">
                    {transaction?.type === 'register' && 'Cadastro'}
                    {transaction?.type === 'request-inspection' && 'Solicitação de inspeção'}
                    {transaction?.type === 'accept-inspection' && 'Aceitar inspeção'}
                    {transaction?.type === 'realize-inspection' && 'Finalizar inspeção'}
                    {transaction?.type === 'buy-tokens' && 'Compra de RC'}
                    {transaction?.type === 'burn-tokens' && 'Contribuição'}
                    {transaction?.type === 'invalidate-inspection' && 'Invalidar inspeção'}
                    {transaction?.type === 'dev-report' && 'Relatório de contribuição'}
                    {transaction?.type === 'withdraw-tokens' && 'Sacar tokens'}
                    {transaction?.type === 'invalidate-user' && 'Invalidar usuário'}
                    {transaction?.type === 'invite-user' && 'Convidar usuário'}
                </span>
            </p>

            <div>
                <button
                    className="w-full h-10 rounded-full bg-blue-primary font-bold text-white"
                    onClick={handleFinishTransaction}
                >
                    Finalizar transação
                </button>

                <AlertDialog>
                    <AlertDialogTrigger 
                        className="mt-3 w-full flex items-center justify-center text-center h-5 text-red-400 font-semibold"
                    >
                        {loadingDiscard ? (
                            <div className="w-5 h-5 bg-red-500 animate-spin"/>
                        ): 'Descartar transação'}
                    </AlertDialogTrigger>
                    
                    <AlertDialogContent 
                        className="bg-container-primary"
                    >
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Atenção!</AlertDialogTitle>
                            <AlertDialogDescription className="text-white">
                                Ao descartar a transação você não conseguirá desfazer essa ação. Deseja descartar?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                                className="bg-red-600 text-white"
                                onClick={handleDiscardTransaction}
                            >
                                Descartar transação
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            </div>

            {loadingTransaction && (
                <LoadingTransaction
                    close={() => setLoadingTransaction(false)}
                    success={transactionSuccess}
                    typeTransaction="checkout"
                    transactionCheckoutData={transaction}
                />
            )}
        </div>
    )
}