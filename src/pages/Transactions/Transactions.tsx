import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../../hooks/useMainContext";
import { TransactionItem } from "../../components/TransactionItem/TransactionItem";
import { GoBackButton } from "../../components/GoBackButton/GoBackButton";
import { useNetwork } from "@/hooks/useNetwork";

export function Transactions() {
    const {isSupported} = useNetwork();
    const navigate = useNavigate();
    const { walletConnected, transactions } = useMainContext();

    useEffect(() => {
        if (walletConnected === '') {
            navigate('/', { replace: true })
        }
        if(!isSupported){
            navigate('/', {replace: true})
        }
    }, [walletConnected]);

    return (
        <main className="h-screen flex flex-col items-center justify-center bg-gradient-to-t from-[#1F5D38] to-[#043832]">
            <div className="flex flex-col h-full w-full lg:max-w-[420px] overflow-y-auto px-3 lg:border-2 border-white rounded-lg">
                <div className='flex items-center gap-2 my-10'>
                    <GoBackButton />
                    <h1 className="text-white font-bold text-2xl">Suas transações</h1>
                </div>

                <div className="flex flex-col gap-3 mt-10 pb-10">
                    {transactions.map(item => (
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