import { Link, useNavigate } from "react-router-dom";
import TokenImg from '../../assets/img/token.png';
import LogoChain from '../../assets/img/logo-chain.png';
import { useMainContext } from "../../hooks/useMainContext";
import { useEffect, useState } from "react";
import { TransactionItem } from "../../components/TransactionItem/TransactionItem";
import { Icon } from "../../components/Icon/Icon";
import { getTransactionsCheckout } from "../../services/checkout/transactions";
import { TransactionCheckoutProps } from "../../interfaces/transactionsCheckout";
import { TransactionCheckoutItem } from "../CheckoutRC/components/TransactionCheckoutItem/TransactionCheckoutItem";
import { useNetwork } from "@/hooks/useNetwork";

export function Home() {
    const { isSupported } = useNetwork();
    const navigate = useNavigate();
    const { walletConnected, balanceUser, balanceSIN, transactions, disconnect } = useMainContext();
    const [visibleBalance, setVisibleBalance] = useState(false);
    const [openTransactions, setOpenTransactions] = useState<TransactionCheckoutProps[]>([]);

    useEffect(() => {
        if (walletConnected === '') {
            navigate('/', { replace: true })
        }
        if (!isSupported) {
            navigate('/', { replace: true })
        }
        getOpenTransactions();
    }, [walletConnected, isSupported]);

    function toggleVisibilityBalance() {
        setVisibleBalance(oldValue => !oldValue);
    }

    async function getOpenTransactions() {
        const response = await getTransactionsCheckout(walletConnected);
        if (response.success) {
            setOpenTransactions(response.openTransactions)
        }
    }

    return (
        <main className="h-screen flex flex-col items-center bg-gradient-to-t from-[#1F5D38] to-[#043832] overflow-y-auto">
            <div className="flex flex-col w-full h-full lg:max-w-[420px] pb-20 px-3 lg:border-2 border-white rounded-lg overflow-x-hidden">

                <h1 className="text-white font-bold text-5xl my-10">Sintrop Pay</h1>

                <div className="flex flex-col gap-1 mb-5">
                    <h3 className="font-bold text-white text-2xl">Olá</h3>
                    <p className="text-white text-sm text-truncate">{walletConnected}</p>
                    <button
                        className="font-bold text-red-400 text-start"
                        onClick={disconnect}
                    >
                        Desconectar wallet
                    </button>
                </div>

                <div
                    className="bg-container-primary rounded-md px-5 py-3 flex flex-col w-full"
                >
                    <div className="flex items-center w-full justify-between">
                        <p className="text-white text-lg">Seus saldos</p>
                        <button
                            className="p-2"
                            onClick={toggleVisibilityBalance}
                        >
                            <Icon name="eyeOff" size={20} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 my-5">
                            <img
                                src={TokenImg}
                                className="w-8 h-8 object-contain"
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

                    <div className="flex items-center justify-between w-full border-t border-container-secondary">
                        <div className="flex items-center gap-2 my-5">
                            <img
                                src={LogoChain}
                                className="w-8 h-8 object-contain"
                            />

                            <p className="text-white text-lg">SIN</p>
                        </div>

                        <p className="font-bold text-white text-xl">
                            {visibleBalance ? (
                                Number(balanceSIN).toFixed(5)
                            ) : (
                                '*************'
                            )}
                        </p>
                    </div>

                </div>

                <div className="flex flex-col gap-3 mt-5">
                    <p className="text-white text-lg">O que você gostaria de fazer?</p>
                    <Link
                        className="w-full h-14 bg-blue-primary rounded-md px-5 py-2 shadow-lg flex items-center gap-3"
                        to='/receive'
                    >
                        <Icon name="house" size={30} />

                        <p className="text-white">Vender/Receber</p>
                    </Link>
                    <Link
                        className="w-full h-14 bg-blue-primary rounded-md px-5 py-2 shadow-lg flex items-center gap-3"
                        to='/send'
                    >
                        <Icon name="cart" size={30} />

                        <p className="text-white">Pagar/Enviar</p>
                    </Link>

                    <Link
                        className="w-full h-14 bg-blue-primary rounded-md px-5 py-2 shadow-lg flex items-center gap-3"
                        to='/transactions'
                    >
                        <Icon name="sheet" size={30} />

                        <p className="text-white">Extrato</p>
                    </Link>

                    <Link
                        className="w-full h-14 bg-blue-primary rounded-md px-5 py-2 shadow-lg flex items-center gap-3"
                        to='/checkout-rc'
                    >
                        <div className="w-10 h-10 bg-red-400" />

                        <p className="text-white">Checkout Crédito de Regeneração</p>
                    </Link>
                </div>

                {openTransactions.length > 0 && (
                    <div className="mt-5">
                        <p className="text-white text-lg mb-1">Transações em aberto no Checkout do Crédito de Regeneração</p>

                        {openTransactions.map(item => (
                            <TransactionCheckoutItem
                                key={item.id}
                                transaction={item}
                                reloadTransactions={getOpenTransactions}
                            />
                        ))}
                    </div>
                )}

                <p className="text-gray-300 text-xs text-center mt-7">Últimas movimentações</p>

                <div className="flex flex-col gap-3 mt-2">
                    {transactions.length === 0 ? (
                        <p className="mt-10 text-center mx-10 text-white">Você não possui nenhuma movimentação!</p>
                    ) : (
                        <>
                            {transactions.slice(0, 5).map(item => (
                                <TransactionItem
                                    key={item.hash}
                                    data={item}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </main>
    )
}