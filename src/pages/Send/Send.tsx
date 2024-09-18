import { useState } from "react"
import { ModalScanQR } from "./components/ModalScanQR/ModalScanQR";
import { useNavigate } from "react-router-dom";

export function Send() {
    const navigate = useNavigate();
    const [ler, setLer] = useState(false);
    const [paymentCode, setPaymentCode] = useState('');

    function handleNavigateToConfirm(paymentCode: string) {
        navigate(`/confirm-payment/${paymentCode}`);
    }

    return (
        <main className="h-screen flex flex-col items-center justify-center bg-gradient-to-t from-[#1F5D38] to-[#043832]">
            <div className="flex flex-col w-full lg:max-w-[420px] px-3 lg:px-0">
                <h1 className="text-white font-bold text-5xl mb-20">Pay</h1>

                <div className="flex flex-col gap-1 w-full p-3 rounded-md bg-container-primary">
                    <div className='flex flex-col gap-1 w-full'>
                        <label className='text-white' htmlFor='input-code'>Cole o código de pagamento::</label>
                        <input
                            name='input-code'
                            value={paymentCode}
                            onChange={(e) => setPaymentCode(e.target.value)}
                            className='w-full px-3 h-14 text-white rounded-md bg-container-secondary'
                            placeholder='Digite aqui'
                        />

                        {paymentCode.trim() && (
                            <button
                                className="bg-blue-primary w-[200px] h-10 items-center justify-center font-bold text-white rounded-md"
                                onClick={() => handleNavigateToConfirm(paymentCode)}
                            >
                                Continuar
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col items-center w-full">
                        <p className="text-xs text-gray-300 my-5">ou escaneie um QR Code</p>
                        <button
                            className="bg-blue-primary w-[200px] h-10 items-center justify-center font-bold text-white rounded-md"
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