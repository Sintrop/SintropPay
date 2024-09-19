import { createContext, ReactNode, useEffect, useState } from "react";
import { SyncWallet } from "../services/SyncWallet";
import { GetBalanceRC } from "../services/web3/RCToken";
import { GetTransactionsUser, TransactionProps } from "../services/GetTransactionsUser";

interface ReturnSyncWalletProps {
    success: boolean;
}

export interface MainContextProps {
    walletConnected: string;
    syncWallet: () => Promise<ReturnSyncWalletProps>;
    balanceUser: string;
    transactions: TransactionProps[];
}

interface MainProviderProps {
    children: ReactNode;
}

export const MainContext = createContext({} as MainContextProps);

export function MainContextProvider({ children }: MainProviderProps) {
    const [walletConnected, setWalletConnected] = useState('');
    const [balanceUser, setBalanceUser] = useState('');
    const [transactions, setTransactions] = useState<TransactionProps[]>([]);

    useEffect(() => {
        if (walletConnected !== '') {
            getBalanceRC();
            getTransactions();
        }
    }, [walletConnected]);

    async function getBalanceRC() {
        const response = await GetBalanceRC(walletConnected);
        setBalanceUser(response);
    }

    async function getTransactions(){
        const response = await GetTransactionsUser(walletConnected);
        setTransactions(response);
    }

    async function syncWallet() {
        const wallet = await SyncWallet();

        if (wallet !== '') {
            setWalletConnected(wallet);
            return {
                success: true,
            };
        }

        return {
            success: false,
        };
    }

    return (
        <MainContext.Provider
            value={{
                walletConnected,
                syncWallet,
                balanceUser,
                transactions
            }}
        >
            {children}
        </MainContext.Provider>
    )
}