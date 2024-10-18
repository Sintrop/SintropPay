import { useState } from "react";
import { TransactionCheckoutProps } from "../../../../interfaces/transactionsCheckout"
import { LoadingTransaction } from "../../../../components/LoadingTransaction/LoadingTransaction";
import { toast } from "react-toastify";
import { format } from "date-fns";

interface Props {
    transaction: TransactionCheckoutProps;
    reloadTransactions: () => void;
}
export function TransactionItem({ transaction, reloadTransactions }: Props) {
    const [loadingTransaction, setLoadingTransaction] = useState(false);

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
        <div className="w-full flex flex-col justify-between rounded-md bg-container-secondary p-3 h-[170px]">
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

                <button
                    className="mt-3 text-center flex items-center justify-center w-full font-semibold text-red-500"
                >
                    Descartar transação
                </button>
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