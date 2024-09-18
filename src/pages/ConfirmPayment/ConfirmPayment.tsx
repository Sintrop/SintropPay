import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PaymentDataProps, SplitPaymentCode } from "../../services/SplitPaymentCode";

export function ConfirmPayment(){
    const {paymentCode} = useParams();
    const [paymentData, setPaymentData]= useState({} as PaymentDataProps);

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
            <div className="flex flex-col w-full lg:max-w-[1024px]">
                <h1 className="text-white font-bold text-5xl mb-20">Revise os dados</h1>

                <div className="flex flex-col w-full p-3 rounded-md bg-container-primary">
                    <p className="text-white font-bold">Destinatário:</p>
                    <p className="text-white mb-3">{paymentData?.walletToSend}</p>

                    <p className="text-white font-bold">Moeda:</p>
                    <p className="text-white mb-3">{paymentData?.criptoTransfer}</p>

                    <p className="text-white font-bold">Valor:</p>
                    <p className="text-white mb-3">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(paymentData?.valueTransfer)} {paymentData?.criptoTransfer}</p>

                    <p className="text-white font-bold">Valor original:</p>
                    <p className="text-white mb-3">{paymentData?.originalValue} {paymentData?.calculationCurrency}</p>

                    <p className="text-white font-bold">Cotação utilizada no momento:</p>
                    <p className="text-white mb-3">{paymentData?.priceMoment} {paymentData?.calculationCurrency}</p>

                    <div className="mt-10 flex justify-end">
                        <button
                            className="h-12 px-10 rounded-md bg-blue-primary text-white font-bold"
                        >
                            Confirmar transação
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}