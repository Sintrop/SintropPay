import { useEffect, useState } from 'react';
import TokenImg from '../../assets/img/token.png';

export function Receive() {
    const [unit, setUnit] = useState('brl');
    const [saleValue, setSaleValue] = useState('');
    const [totalReceive, setTotalReceive] = useState(0);

    useEffect(() => {
        if(saleValue.trim()){
            setTotalReceive(Number(saleValue) * 0.0282);
        }else{
            setTotalReceive(0);
        }
    }, [saleValue])

    return (
        <main className="h-screen flex flex-col items-center justify-center bg-gradient-to-t from-[#1F5D38] to-[#043832]">
            <div className="flex flex-col w-full lg:max-w-[1024px]">
                <h1 className="text-white font-bold text-5xl mb-10">Receive</h1>

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
                                <option value='brl'>R$ (BRL)</option>
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
                        <p className='font-bold text-green-primary text-xl'>{Intl.NumberFormat('pt-BR', {maximumFractionDigits:0}).format(totalReceive)} RC</p>
                    </div>

                    <button
                        className='font-bold text-white w-full h-14 rounded-md bg-blue-primary mt-10'
                    >
                        Gerar código de pagamento
                    </button>
                </div>
            </div>
        </main>
    )
}