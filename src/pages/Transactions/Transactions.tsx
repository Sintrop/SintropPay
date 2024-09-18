import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../../hooks/useMainContext";
import { TransactionProps, GetTransactionsUser } from "../../services/GetTransactionsUser";
import { TransactionItem } from "../../components/TransactionItem/TransactionItem";

export function Transactions(){
    const navigate = useNavigate();
    const {walletConnected} = useMainContext();
    const [transactions, setTransactions] = useState<TransactionProps[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(walletConnected === ''){
            navigate('/', {replace: true})
        }

        if(walletConnected !== ''){
            getTransactions();
        }
    }, [walletConnected]);

    async function getTransactions(){
        setLoading(true);
        const response = await GetTransactionsUser(walletConnected);
        setTransactions(response);
        setLoading(false);
    }

    return(
        <main className="h-screen flex flex-col items-center justify-center bg-gradient-to-t from-[#1F5D38] to-[#043832]">
            <div className="flex flex-col w-full lg:max-w-[420px] overflow-y-auto px-3 lg:px-0">
                <h1 className="text-white font-bold text-5xl mt-5">Suas transações</h1>

                <div className="flex flex-col gap-3 mt-10 pb-10">
                    {loading && (
                        <div
                            className="w-10 h-10 bg-red-500 animate-spin"
                        />
                    )}

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