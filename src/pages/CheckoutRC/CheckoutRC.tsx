import { useEffect, useState } from "react";
import { GoBackButton } from "../../components/GoBackButton/GoBackButton";
import { TransactionCheckoutProps } from "../../interfaces/transactionsCheckout";
import { getTransactionsCheckout } from "../../services/checkout/transactions";
import { useMainContext } from "../../hooks/useMainContext";
import { TransactionItem } from "./components/TransactionItem/TransactionItem";

export function CheckoutRC() {
    const {walletConnected} = useMainContext();
    const [transactions, setTransactions] = useState<TransactionCheckoutProps[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        handleGetTransactions();
    }, []);

    async function handleGetTransactions(){
        setLoading(true);

        const response = await getTransactionsCheckout(walletConnected);
        if(response.success){
            setTransactions(response.transactions);
        }else{

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
                    {transactions.map(item => (
                        <TransactionItem
                            key={item.id}
                            transaction={item}
                            reloadTransactions={handleGetTransactions}
                        />
                    ))}
                </div>
            </div>
        </main>
    )
}