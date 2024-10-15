import { useEffect, useState } from "react";
import { useMainContext } from "../../hooks/useMainContext";
import { BurnTokensWithNewService, ReturnTransactionProps, SendTransaction } from "../../services/web3/V7/RCToken";
import { TransactionCheckoutProps } from "../../interfaces/transactionsCheckout";

interface TransactionDataProps {
    walletTo?: string;
    value?: number;
}

interface Props {
    close: () => void;
    success: () => void;
    typeTransaction: 'payment' | 'checkout';
    transactionData?: TransactionDataProps;
    transactionCheckoutData?: TransactionCheckoutProps;
}

export function LoadingTransaction({ close, success, typeTransaction, transactionData, transactionCheckoutData }: Props) {
    const { walletConnected } = useMainContext();
    const [loading, setLoading] = useState(false);
    const [transactionSuccessfully, setTransactionSuccessfully] = useState(false);
    const [returnTransactionData, setReturnTransactionData] = useState({} as ReturnTransactionProps);

    useEffect(() => {
        setLoading(true);
    }, []);

    useEffect(() => {
        if (loading) {
            executeTransaction();
        }
    }, [loading])

    function executeTransaction() {
        if (typeTransaction === 'payment') {
            handleSendTransaction();
        }

        if(typeTransaction === 'checkout'){
            if(transactionCheckoutData?.type === 'burn-tokens'){
                burnTokens();
            }
        }
    }

    async function handleSendTransaction() {
        const response = await SendTransaction({
            value: transactionData?.value,
            walletTo: transactionData?.walletTo,
            walletFrom: walletConnected
        });

        setReturnTransactionData(response);

        if (response.success) {
            setLoading(false)
            setTransactionSuccessfully(true);

            return;
        }

        setLoading(false);
    }

    async function burnTokens(){
        if(transactionCheckoutData?.additionalData){
            const additionalData = JSON.parse(transactionCheckoutData?.additionalData)

            const response = await BurnTokensWithNewService(additionalData?.value, walletConnected);
            setReturnTransactionData(response);

            if(response.success){
                setTransactionSuccessfully(true);
            }

            setLoading(false);
        }
    }

    return (
        <div className='flex justify-center items-center inset-0 '>
            <div className='bg-[rgba(0,0,0,0.6)] fixed inset-0 ' />

            <div className='absolute flex flex-col items-center justify-center p-3 lg:w-[500px] lg:h-[500px] bg-container-primary rounded-md mx-2 my-2 lg:my-auto lg:mx-auto inset-0 border-2 z-10'>
                {loading ? (
                    <>
                        <p className="font-bold text-white text-xl text-center mx-10">Aguarde enquanto a transação é processada...</p>

                        <div className="w-10 h-10 bg-green-500 animate-spin mt-20" />
                    </>
                ) : (
                    <>
                        {transactionSuccessfully ? (
                            <>
                                <p className="font-bold text-white text-xl text-center">Transação realizada com sucesso</p>

                                <div className="flex flex-col w-full mt-14">
                                    <p className="text-white text-sm font-bold">Hash da transação</p>
                                    <a
                                        className="text-sm text-white underline"
                                        href={`https://sepolia.etherscan.io/tx/${returnTransactionData?.transactionHash}`}
                                        target="_blank"
                                    >
                                        {returnTransactionData?.transactionHash}
                                    </a>

                                    <p className="text-white text-sm font-bold mt-5">Destinatário</p>
                                    <p className="text-sm text-white">{transactionData?.walletTo}</p>

                                    <button
                                        onClick={success}
                                        className="text-white font-bold px-20 h-12 rounded-md bg-blue-primary mt-10"
                                    >
                                        Continuar
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {returnTransactionData.message && (
                                    <>
                                        <p className="font-bold text-white text-xl text-center">Algo deu errado com sua transação</p>
                                        <p className="mt-20 text-xs text-gray-400 text-center">Erro</p>
                                        <p className="text-white">Code: {returnTransactionData?.code}</p>
                                        <p className="text-white text-center">Mensagem: {returnTransactionData?.message.replace('Returned error:', '')}</p>

                                        <button
                                            onClick={close}
                                            className="text-white font-bold px-20 h-12 rounded-md bg-blue-primary mt-10"
                                        >
                                            Fechar
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}

            </div>
        </div>
    )
}