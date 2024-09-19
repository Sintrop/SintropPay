import { Link, useNavigate } from "react-router-dom";
import TokenImg from '../../assets/img/token.png';
import { useMainContext } from "../../hooks/useMainContext";
import { useEffect, useState } from "react";
import { GetTransactionsUser, TransactionProps } from "../../services/GetTransactionsUser";
import { TransactionItem } from "../../components/TransactionItem/TransactionItem";
import { Icon } from "../../components/Icon/Icon";

export function Home() {
    const navigate = useNavigate();
    const {walletConnected, balanceUser} = useMainContext();
    const [visibleBalance, setVisibleBalance] = useState(false);
    const [transactions, setTransactions] = useState<TransactionProps[]>([]);

    useEffect(() => {
        if(walletConnected === ''){
            navigate('/', {replace: true})
        }
        if(walletConnected !== ''){
            getTransactions();
        }
    }, [walletConnected]);

    function toggleVisibilityBalance(){
        setVisibleBalance(oldValue => !oldValue);
    }

    async function getTransactions(){
        const response = await GetTransactionsUser(walletConnected);
        setTransactions(response);
    }

    return (
        <main className="h-screen flex flex-col items-center bg-gradient-to-t from-[#1F5D38] to-[#043832] overflow-y-auto">
            <div className="flex flex-col w-full lg:max-w-[420px] pb-20 px-3 lg:border-2 border-white rounded-lg overflow-x-hidden">

                <h1 className="text-white font-bold text-5xl mb-14 mt-10">Sintrop Pay</h1>

                <div
                    className="bg-container-primary rounded-md px-5 py-3 flex flex-col w-[320px]"
                >
                    <div className="flex items-center w-full justify-between">
                        <p className="text-white text-lg">Meu patrimônio em</p>
                        <button
                            className="w-5 h-5 bg-red-500"
                            onClick={toggleVisibilityBalance}
                        >

                        </button>
                    </div>

                    <div className="flex items-center gap-2 my-5">
                        <img
                            src={TokenImg}
                            className="w-10 h-10 object-contain"
                        />

                        <p className="text-white text-lg">RC</p>
                    </div>

                    <p className="font-bold text-white text-xl">
                        {visibleBalance ? (
                            Number(balanceUser).toFixed(5)
                        ) : (
                            '*************'
                        )}
                    </p>
                </div>

                <div className="flex flex-col gap-2 mt-10">
                    <h3 className="font-bold text-white text-2xl">Olá</h3>
                    <p className="text-white text-sm text-truncate">{walletConnected}</p>
                </div>

                <div className="flex flex-col gap-3 mt-5">
                    <p className="text-white text-lg">O que você gostaria de fazer?</p>
                    <Link
                        className="w-full h-14 bg-blue-primary rounded-md px-5 py-2 shadow-lg flex items-center gap-3"
                        to='/receive'
                    >
                        <Icon name="house" size={30}/>

                        <p className="text-white">Vender/Receber</p>
                    </Link>
                    <Link
                        className="w-full h-14 bg-blue-primary rounded-md px-5 py-2 shadow-lg flex items-center gap-3"
                        to='/send'
                    >
                        <Icon name="cart" size={30}/>

                        <p className="text-white">Pagar/Enviar</p>
                    </Link>

                    <Link
                        className="w-full h-14 bg-blue-primary rounded-md px-5 py-2 shadow-lg flex items-center gap-3"
                        to='/transactions'
                    >
                        <Icon name="sheet" size={30}/>

                        <p className="text-white">Extrato</p>
                    </Link>

                    {/* <Link
                        className="w-full h-14 bg-blue-primary rounded-md px-5 py-2 shadow-lg flex items-center gap-3"
                        to='/send'
                    >
                        <div className="w-10 h-10 bg-red-400" />

                        <p className="text-white">Checkout</p>
                    </Link> */}
                </div>

                <p className="text-gray-300 text-xs text-center mt-7">Últimas movimentações</p>

                <div className="flex flex-col gap-3 mt-2">
                    {transactions.slice(0, 5).map(item => (
                        <TransactionItem
                            key={item.hash}
                            data={item}
                        />
                    ))}
                </div>
            </div>
        </main>
    )
}