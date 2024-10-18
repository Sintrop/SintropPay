import { useEffect, useState } from "react";
import { GoBackButton } from "../../components/GoBackButton/GoBackButton";
import { TransactionCheckoutProps } from "../../interfaces/transactionsCheckout";
import { getTransactionsCheckout } from "../../services/checkout/transactions";
import { useMainContext } from "../../hooks/useMainContext";
import { TransactionCheckoutItem } from "./components/TransactionCheckoutItem/TransactionCheckoutItem";

export function CheckoutRC() {
    const { walletConnected } = useMainContext();
    const [openTransactions, setOpenTransactions] = useState<TransactionCheckoutProps[]>([]);
    const [finishedTransactions, setFinishedTransactions] = useState<TransactionCheckoutProps[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState('open');

    useEffect(() => {
        handleGetTransactions();
    }, []);

    async function handleGetTransactions() {
        setLoading(true);

        const response = await getTransactionsCheckout(walletConnected);
        if (response.success) {
            setOpenTransactions(response.openTransactions);
            setFinishedTransactions(response.finishedTransactions);
        } else {

        }
        setLoading(false);
    }

    return (
        <main className="h-screen flex flex-col items-center justify-center bg-gradient-to-t from-[#1F5D38] to-[#043832]">
            <div className="flex flex-col h-full w-full pb-20 lg:max-w-[420px] px-3 lg:border-2 border-white rounded-lg overflow-y-auto overflow-x-hidden">
                <div className='flex items-center gap-2 my-10'>
                    <GoBackButton />
                    <h1 className="text-white font-bold text-2xl">Checkout RC</h1>
                </div>

                <div className="flex flex-col mt-5 gap-3">
                    <div className="w-full flex justify-center items-center gap-5">
                        <button
                            onClick={() => setSelectedTab('open')}
                            className={`w-[120px] h-10 border-b-2 ${selectedTab === 'open' ? 'border-green-primary text-green-primary' : 'text-white border-transparent'}`}
                        >
                            Abertas
                        </button>

                        <button
                            onClick={() => setSelectedTab('finished')}
                            className={`w-[120px] h-10 border-b-2 ${selectedTab === 'finished' ? 'border-green-primary text-green-primary' : 'text-white border-transparent'}`}
                        >
                            Finalizadas
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center mt-5">
                            <div className="w-10 h-10 bg-green-primary animate-spin" />
                        </div>
                    ) : (
                        <>
                            {selectedTab === 'open' && (
                                <>
                                    {openTransactions.length === 0 ? (
                                        <p className="text-center text-white mt-10 mx-10">
                                            Você não possui nenhuma transação em aberto!
                                        </p>
                                    ) : (
                                        <>
                                            {openTransactions.map(item => (
                                                <TransactionCheckoutItem
                                                    key={item.id}
                                                    transaction={item}
                                                    reloadTransactions={handleGetTransactions}
                                                />
                                            ))}
                                        </>
                                    )}
                                </>
                            )}

                            {selectedTab === 'finished' && (
                                <>
                                    {finishedTransactions.length === 0 ? (
                                        <p className="text-center text-white mt-10 mx-10">
                                            Você não possui nenhuma transação finalizada ou descartada!
                                        </p>
                                    ) : (
                                        <>
                                            {finishedTransactions.map(item => (
                                                <TransactionCheckoutItem
                                                    key={item.id}
                                                    transaction={item}
                                                    reloadTransactions={handleGetTransactions}
                                                />
                                            ))}
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    )
}