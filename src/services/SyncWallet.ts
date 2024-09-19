import { MetaMaskInpageProvider } from "@metamask/providers"
import { toast } from "react-toastify";

declare global{
    interface Window{
        ethereum?: MetaMaskInpageProvider;
    }
}

export async function SyncWallet(): Promise<string>{
    if(window.ethereum){
        try{
            await window?.ethereum.request({
                method: 'eth_requestAccounts'
            });

            const address = window.ethereum.selectedAddress;

            if(address){
                return address;
            }

            return ''
        }catch(err){
            console.log(err);
            return ''
        }
    }else{
        toast.error('Sem provedor ethereum!');
        return ''
    }
}