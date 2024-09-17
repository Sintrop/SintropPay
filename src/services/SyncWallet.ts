import { MetaMaskInpageProvider } from "@metamask/providers"
import { toast } from "react-toastify";

declare global{
    interface Window{
        ethereum?: MetaMaskInpageProvider;
    }
}

export async function SyncWallet(): Promise<string[]>{
    if(window.ethereum){
        try{
            const addresses = window?.ethereum.request({
                method: 'eth_requestAccounts'
            });

            return addresses;
        }catch(err){
            console.log(err);
            return []
        }
    }else{
        toast.error('Sem provedor ethereum!');
        return []
    }
}