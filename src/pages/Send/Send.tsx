import { useState, useEffect } from "react"
import { ModalScanQR } from "./components/ModalScanQR/ModalScanQR";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../../hooks/useMainContext";

export function Send() {
    const navigate = useNavigate();
    const {walletConnected} = useMainContext();
    const [ler, setLer] = useState(false);
    const [paymentCode, setPaymentCode] = useState('');

    useEffect(() => {
        if(walletConnected === ''){
            navigate('/', {replace: true})
        }
    }, [walletConnected]);

    function handleNavigateToConfirm(paymentCode: string) {
        navigate(`/confirm-payment/${paymentCode}`);
    }

    return (
        <main className="h-screen flex flex-col items-center justify-center bg-gradient-to-t from-[#1F5D38] to-[#043832]">
            <div className="flex flex-col h-full w-full lg:max-w-[420px] px-3 lg:border-2 border-white rounded-lg overflow-y-auto">
                <h1 className="text-white font-bold text-5xl my-10">Pagar</h1>

                <div className="flex flex-col gap-1 w-full p-3 rounded-md bg-container-primary">
                    <div className='flex flex-col gap-1 w-full'>
                        <label className='text-white' htmlFor='input-code'>Cole o código de pagamento:</label>
                        <input
                            name='input-code'
                            value={paymentCode}
                            onChange={(e) => setPaymentCode(e.target.value)}
                            className='w-full px-3 h-14 text-white rounded-md bg-container-secondary'
                            placeholder='Digite aqui'
                        />

                        <div className="flex justify-end w-full mt-2">
                            {paymentCode.trim() && (
                                <button
                                    className="bg-blue-primary w-[160px] h-10 items-center justify-center font-bold text-white rounded-md mb-10"
                                    onClick={() => handleNavigateToConfirm(paymentCode)}
                                >
                                    Continuar
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center w-full">
                        <p className="text-xs text-gray-300 my-5">ou escaneie um QR Code</p>
                        <button
                            className="bg-green-primary w-[200px] h-10 items-center justify-center font-bold text-white rounded-md"
                            onClick={() => setLer(true)}
                        >
                            Ler QR Code
                        </button>
                    </div>
                </div>


                {ler && (
                    <ModalScanQR
                        close={() => setLer(false)}
                        scanned={(url) => {
                            handleNavigateToConfirm(url)
                        }}
                    />
                )}
            </div>
        </main>
    )
}