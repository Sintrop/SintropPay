import { useEffect, useState } from 'react';
import TokenImg from '../../assets/img/token.png';
import LogoChain from '../../assets/img/logo-chain.png';
import { ModalGeneratedCode } from './components/ModalGeneratedCode';
import { useMainContext } from '../../hooks/useMainContext';
import { useNavigate } from 'react-router-dom';
import { GoBackButton } from '../../components/GoBackButton/GoBackButton';
import { toast } from 'react-toastify';
import { useNetwork } from '@/hooks/useNetwork';

export function Receive() {
    const { isSupported } = useNetwork();
    const navigate = useNavigate();
    const { walletConnected } = useMainContext();
    const [unit, setUnit] = useState('BRL');
    const [saleValue, setSaleValue] = useState('');
    const [totalReceive, setTotalReceive] = useState(0);
    const [modalGenerated, setModalGenerated] = useState(false);
    const [paymentCode, setPaymentCode] = useState('');
    const [tokenReceive, setTokenReceive] = useState('SIN');

    const RC_TO_BRL = 0.0282;
    const SIN_TO_BRL = 1;

    useEffect(() => {
        if (walletConnected === '') {
            navigate('/', { replace: true })
        }
        if (!isSupported) {
            navigate('/', { replace: true })
        }
    }, [walletConnected]);

    useEffect(() => {
        if (saleValue.trim()) {
            if (tokenReceive === 'RC') setTotalReceive(Number(String(saleValue).replace(',', '.')) / RC_TO_BRL);
            if (tokenReceive === 'SIN') setTotalReceive(Number(String(saleValue).replace(',', '.')) / SIN_TO_BRL);
        } else {
            setTotalReceive(0);
        }
    }, [saleValue]);

    function generatePaymentCode() {
        if (totalReceive === 0) {
            toast.error('Digite um valor para receber')
            return;
        }
        // Estrutura do código de pagamento
        // [WalletDestino]-[ValorParaTransferir]-[MoedaDeTransferência]-[ValorOriginal]-[MoedaDeCalculo]-[CotaçaoNoMomento];

        const code = `${walletConnected}-${String(totalReceive).replace(',', '.')}-${tokenReceive}-${saleValue}-${unit}-${RC_TO_BRL}`;

        setPaymentCode(code);
        setModalGenerated(true)
    }

    return (
        <main className="h-screen flex flex-col items-center bg-gradient-to-t from-[#1F5D38] to-[#043832]">
            <div className="flex flex-col h-full w-full lg:max-w-[420px] px-3 lg:border-2 border-white rounded-lg overflow-y-auto">
                <div className='flex items-center gap-2 my-10'>
                    <GoBackButton />
                    <h1 className="text-white font-bold text-2xl">Vender/Receber</h1>
                </div>


                <div className="flex flex-col gap-1 w-full p-3 rounded-md bg-container-primary">
                    <p className="text-white">Você vai receber em:</p>

                    <div className="flex items-center gap-2 rounded-md bg-container-secondary h-14">
                        <select
                            name='select-unit'
                            value={tokenReceive}
                            onChange={(e) => setTokenReceive(e.target.value)}
                            className='w-full px-3 h-14 text-white rounded-md bg-container-secondary'
                        >
                            <option value='SIN'>SIN</option>
                            <option value='RC'>RC (Crédito de Regeneração)</option>
                        </select>
                    </div>

                    <div className='flex items-center mt-7 gap-5'>
                        <div className='flex flex-col gap-1 w-[49%]'>
                            <label className='text-white' htmlFor='select-unit'>Unidade de venda:</label>
                            <select
                                name='select-unit'
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className='w-full px-3 h-14 text-white rounded-md bg-container-secondary'
                            >
                                <option value='BRL'>R$ (BRL)</option>
                            </select>
                        </div>

                        <div className='flex flex-col gap-1 w-[49%]'>
                            <label className='text-white' htmlFor='value'>Valor da venda:</label>
                            <input
                                name='value'
                                value={saleValue}
                                onChange={(e) => setSaleValue(e.target.value)}
                                className='w-full px-3 h-14 text-white rounded-md bg-container-secondary'
                                placeholder='Digite aqui'
                                type='number'
                            />
                        </div>
                    </div>

                    <div className='flex items-center justify-between mt-5'>
                        <p className='text-white font-bold'>Total a receber</p>

                        <div className='flex items-center gap-2'>
                            <img
                                src={tokenReceive === 'SIN' ? LogoChain : TokenImg}
                                className='w-7 h-7 rounded-full object-contain'
                            />
                            <p className='font-bold text-green-primary text-xl'>{Intl.NumberFormat('pt-BR', { maximumFractionDigits: 5 }).format(totalReceive)} {tokenReceive}</p>
                        </div>
                    </div>

                    <button
                        className='font-bold text-white w-full h-14 rounded-md bg-blue-primary mt-10'
                        onClick={generatePaymentCode}
                    >
                        Gerar código de pagamento
                    </button>
                </div>
            </div>

            {modalGenerated && (
                <ModalGeneratedCode
                    close={() => setModalGenerated(false)}
                    paymentCode={paymentCode}
                />
            )}
        </main>
    )
}