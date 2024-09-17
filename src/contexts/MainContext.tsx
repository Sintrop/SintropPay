import { createContext, ReactNode, useState } from "react";
import { SyncWallet } from "../services/SyncWallet";

interface ReturnSyncWalletProps{
    success: boolean;
}

export interface MainContextProps{
    walletConnected: string;
    syncWallet: () => Promise<ReturnSyncWalletProps>;
}

interface MainProviderProps{
    children: ReactNode;
}

export const MainContext = createContext({} as MainContextProps);

export function MainContextProvider({children}: MainProviderProps){
    const [walletConnected, setWalletConnected] = useState('');

    async function syncWallet(): Promise<ReturnSyncWalletProps>{
        const wallet = await SyncWallet();
        
        if(wallet.length > 0){
            setWalletConnected(wallet[0]);
            return {
                success: true,
            };
        }

        return {
            success: false,
        };
    }

    return(
        <MainContext.Provider
            value={{
                walletConnected,
                syncWallet
            }}
        >
            {children}
        </MainContext.Provider>
    )
}