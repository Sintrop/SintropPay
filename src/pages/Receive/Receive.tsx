import { useEffect, useState } from 'react';
import TokenImg from '../../assets/img/token.png';
import { ModalGeneratedCode } from './components/ModalGeneratedCode';
import { useMainContext } from '../../hooks/useMainContext';
import { useNavigate } from 'react-router-dom';

export function Receive() {
    const navigate = useNavigate();
    const {walletConnected} = useMainContext();
    const [unit, setUnit] = useState('BRL');
    const [saleValue, setSaleValue] = useState('');
    const [totalReceive, setTotalReceive] = useState(0);
    const [modalGenerated, setModalGenerated] = useState(false);
    const [paymentCode, setPaymentCode] = useState('');

    const RC_TO_BRL = 0.0282;

    useEffect(() => {
        if(walletConnected === ''){
            navigate('/', {replace: true})
        }
    }, [walletConnected]);

    useEffect(() => {
        if(saleValue.trim()){
            setTotalReceive(Number(String(saleValue).replace(',', '.')) / RC_TO_BRL);
        }else{
            setTotalReceive(0);
        }
    }, [saleValue]);

    function generatePaymentCode(){
        // Estrutura do código de pagamento
        // [WalletDestino]-[ValorParaTransferir]-[MoedaDeTransferência]-[ValorOriginal]-[MoedaDeCalculo]-[CotaçaoNoMomento];

        const code = `${walletConnected}-${String(totalReceive).replace(',', '.')}-RC-${saleValue}-${unit}-${RC_TO_BRL}`;

        setPaymentCode(code);
        setModalGenerated(true)
    }

    return (
        <main className="h-screen flex flex-col items-center bg-gradient-to-t from-[#1F5D38] to-[#043832]">
            <div className="flex flex-col h-full w-full lg:max-w-[420px] px-3 lg:border-2 border-white rounded-lg overflow-y-auto">
                <h1 className="text-white font-bold text-5xl my-10">Receber</h1>

                <div className="flex flex-col gap-1 w-full p-3 rounded-md bg-container-primary">
                    <p className="text-white">Você vai receber em:</p>

                    <div className="flex items-center gap-2 rounded-md bg-container-secondary px-5 h-14">
                        <img
                            src={TokenImg}
                            className="w-10 h-10 object-contain"
                        />

                        <p className='text-white text-lg'>Crédito de Regeneração</p>
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
                        <p className='font-bold text-green-primary text-xl'>{Intl.NumberFormat('pt-BR', {maximumFractionDigits: 2}).format(totalReceive)} RC</p>
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