import { MetaMaskInpageProvider } from "@metamask/providers"
import { toast } from "react-toastify";

declare global{
    interface Window{
        ethereum?: MetaMaskInpageProvider;
    }
}

export async function SyncWallet(){
    if(window.ethereum){
        try{
            const address = window?.ethereum.request({
                method: 'eth_requestAccounts'
            });

            return address;
        }catch(err){
            console.log(err);
        }
    }else{
        toast.error('Sem provedor ethereum!')
    }
}