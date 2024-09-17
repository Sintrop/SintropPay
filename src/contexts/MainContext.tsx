import { createContext, ReactNode, useState } from "react";

export interface MainContextProps{
    walletConnected: string
}

interface MainProviderProps{
    children: ReactNode;
}

export const MainContext = createContext({} as MainContextProps);

export function MainContextProvider({children}: MainProviderProps){
    const [walletConnected, setWalletConnected] = useState('');

    return(
        <MainContext.Provider
            value={{
                walletConnected
            }}
        >
            {children}
        </MainContext.Provider>
    )
}