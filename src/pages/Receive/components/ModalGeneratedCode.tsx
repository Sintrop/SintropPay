import { useEffect, useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { useMainContext } from '../../../hooks/useMainContext';
import { toast } from 'react-toastify';
import { PaymentDataProps, SplitPaymentCode } from '../../../services/PaymentCode';

interface Props{
    close: () => void;
    paymentCode: string;
}

export function ModalGeneratedCode({close, paymentCode}: Props) {
    const {walletConnected} = useMainContext();
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

    function handleCopyToClipboard(){
        navigator.clipboard.writeText(paymentCode);
        toast.success('Código copiado para área de transferência!');
    }
    
    return (
        <div className='flex justify-center items-center inset-0 '>
            <div className='bg-[rgba(0,0,0,0.6)] fixed inset-0 ' />

            <div className='absolute flex flex-col p-3 lg:w-[500px] lg:h-[600px] bg-container-primary rounded-md mx-2 my-2 lg:my-auto lg:mx-auto inset-0 border-2 z-10'>
                <button
                    className='absolute right-5 top-5'
                    onClick={close}
                >
                    X
                </button>

                <p className="text-white font-bold mt-10">Wallet de destino:</p>
                <p className="text-white mb-3">{walletConnected}</p>

                <p className="text-white font-bold">Valor:</p>
                <p className="text-white mb-3">{paymentData?.originalValue} {paymentData?.calculationCurrency}</p>

                <p className="text-white font-bold">Conversão:</p>
                <p className="text-white mb-3">{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(paymentData?.valueTransfer)} {paymentData?.criptoTransfer}</p>

                <div className="mt-5 items-center flex flex-col">
                    <button
                        className="font-bold text-white px-10 h-14 rounded-md bg-blue-primary"
                        onClick={handleCopyToClipboard}
                    >
                        Copiar código de pagamento
                    </button>

                    <p className="text-xs text-gray-300 my-5">ou escaneie o QR Code abaixo</p>

                    <QRCode 
                        value={paymentCode} 
                        size={170}
                    />
                </div>
            </div>
        </div>
    )
}