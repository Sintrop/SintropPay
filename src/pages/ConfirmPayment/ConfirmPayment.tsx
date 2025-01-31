import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PaymentDataProps, SplitPaymentCode } from "../../services/PaymentCode";
import { LoadingTransaction } from "../../components/LoadingTransaction/LoadingTransaction";
import { useMainContext } from "../../hooks/useMainContext";
import { GoBackButton } from "../../components/GoBackButton/GoBackButton";
import { useNetwork } from "@/hooks/useNetwork";

export function ConfirmPayment(){
    const {isSupported} = useNetwork();
    const {walletConnected} = useMainContext();
    const navigate = useNavigate();
    const {paymentCode} = useParams();
    const [paymentData, setPaymentData]= useState({} as PaymentDataProps);
    const [loadingTransaction, setLoadingTransaction] = useState(false);

    useEffect(() => {
        if(walletConnected === ''){
            navigate('/', {replace: true})
        }
        if(!isSupported){
            navigate('/', {replace: true})
        }
    }, [walletConnected]);

    useEffect(() => {
        splitCode();
    }, []);

    function splitCode(){
        const data = SplitPaymentCode(paymentCode as string);
        if(data){
            setPaymentData(data);
        }
    }

    return(
        <main className="h-screen flex flex-col items-center justify-center bg-gradient-to-t from-[#1F5D38] to-[#043832]">
            <div className="flex flex-col h-full w-full pb-20 lg:max-w-[420px] px-3 lg:border-2 border-white rounded-lg overflow-y-auto overflow-x-hidden">
            <div className='flex items-center gap-2 my-10'>
                    <GoBackButton/>
                    <h1 className="text-white font-bold text-2xl">Revise os dados</h1>
                </div>

                <div className="flex flex-col w-full p-3 rounded-md bg-container-primary">
                    <p className="text-white font-bold">Destinatário:</p>
                    <p className="text-white mb-3">{paymentData?.walletToSend}</p>

                    <p className="text-white font-bold">Moeda:</p>
                    <p className="text-white mb-3">{paymentData?.criptoTransfer}</p>

                    <p className="text-white font-bold">Valor:</p>
                    <p className="text-white mb-3">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 5}).format(paymentData?.valueTransfer)} {paymentData?.criptoTransfer}</p>

                    <p className="text-white font-bold">Valor original:</p>
                    <p className="text-white mb-3">{paymentData?.originalValue} {paymentData?.calculationCurrency}</p>

                    <p className="text-white font-bold">Cotação utilizada no momento:</p>
                    <p className="text-white mb-3">{paymentData?.priceMoment} {paymentData?.calculationCurrency}</p>

                    <div className="mt-10 flex justify-end">
                        <button
                            className="h-12 px-10 rounded-md bg-blue-primary text-white font-bold"
                            onClick={() => setLoadingTransaction(true)}
                        >
                            Confirmar transação
                        </button>
                    </div>
                </div>
            </div>

            {loadingTransaction && (
                <LoadingTransaction
                    close={() => setLoadingTransaction(false)}
                    success={() => {
                        navigate('/dashboard', {replace: true})
                    }}
                    typeTransaction="payment"
                    transactionData={{
                        value: paymentData.valueTransfer,
                        walletTo: paymentData.walletToSend,
                        tokenTransfer: paymentData.criptoTransfer
                    }}
                />
            )}
        </main>
    )
}