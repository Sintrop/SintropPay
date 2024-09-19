import { createContext, ReactNode, useEffect, useState } from "react";
import { SyncWallet } from "../services/SyncWallet";
import { GetBalanceRC } from "../services/web3/RCToken";

interface ReturnSyncWalletProps {
    success: boolean;
}

export interface MainContextProps {
    walletConnected: string;
    syncWallet: () => Promise<ReturnSyncWalletProps>;
    balanceUser: string;
}

interface MainProviderProps {
    children: ReactNode;
}

export const MainContext = createContext({} as MainContextProps);

export function MainContextProvider({ children }: MainProviderProps) {
    const [walletConnected, setWalletConnected] = useState('');
    const [balanceUser, setBalanceUser] = useState('');

    useEffect(() => {
        if (walletConnected !== '') {
            getBalanceRC();
        }
    }, [walletConnected]);

    async function getBalanceRC() {
        const response = await GetBalanceRC(walletConnected);
        setBalanceUser(response);
    }

    async function syncWallet() {
        const wallet = await SyncWallet();

        if (wallet) {
            setWalletConnected(wallet[0]);
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
                balanceUser
            }}
        >
            {children}
        </MainContext.Provider>
    )
}