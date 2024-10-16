import { useState } from "react";
import { TransactionCheckoutProps } from "../../../../interfaces/transactionsCheckout"
import { LoadingTransaction } from "../../../../components/LoadingTransaction/LoadingTransaction";

interface Props {
    transaction: TransactionCheckoutProps;
}
export function TransactionItem({ transaction }: Props) {
    const [loadingTransaction, setLoadingTransaction] = useState(false);
    
    async function handleFinishTransaction() {
        if (transaction?.type === 'register') {
            //register();
        }
        if (transaction?.type === 'accept-inspection') {
            //acceptInspection()
        }
        if (transaction?.type === 'realize-inspection') {
            //finishNewVersion();
        }
        if (transaction?.type === 'request-inspection') {
           // requestInspection();
        }
        if (transaction?.type === 'buy-tokens') {
            //buyTokens();
        }
        if (transaction?.type === 'burn-tokens') {
            setLoadingTransaction(true);
        }
        if (transaction?.type === 'invalidate-inspection') {
            //invalidateInspection();
        }
        if (transaction?.type === 'dev-report') {
            //sendDevReport();
        }
        if (transaction?.type === 'withdraw-tokens') {
            //withdraw();
        }
        if (transaction?.type === 'invalidate-user') {
            //invalidateUser();
        }
        if (transaction?.type === 'invite-user') {
            //inviteUser();
        }
    }

    return (
        <div className="w-full flex flex-col justify-between rounded-md bg-container-secondary p-3 h-[170px]">
            <p className="font-bold text-white">
                Tipo da transação:
                <span className="font-normal ml-2">
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

            <button
                className="w-full h-10 rounded-full bg-blue-primary font-bold text-white"
                onClick={handleFinishTransaction}
            >
                Finalizar transação
            </button>

            {loadingTransaction && (
                <LoadingTransaction
                    close={() => setLoadingTransaction(false)}
                    success={() => {setLoadingTransaction(false)}}
                    typeTransaction="checkout"
                    transactionCheckoutData={transaction}
                />
            )}
        </div>
    )
}