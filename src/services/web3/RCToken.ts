import { RCTokenContract } from "./Contracts";
import {web3} from './Contracts';

interface SendTransactionProps{
    walletFrom: string;
    walletTo?: string;
    value?: number;
}

export interface ReturnTransactionProps{
    transactionHash: string;
    success: boolean;
    message: string;
    code: number;
}

interface ErrTransactionProps{
    code: number;
    message: string;
}

export async function SendTransaction({value, walletFrom, walletTo}: SendTransactionProps): Promise<ReturnTransactionProps>{
    let success = false;
    let transactionHash = '';
    let message = '';
    let code = 0;

    try{
        await RCTokenContract.methods.transfer(walletTo, web3.utils.toWei(value as number, 'ether')).send({from: walletFrom})
        .on("confirmation", (receipt) =>
            console.log(receipt)
        )
        .on('transactionHash', hash => {
            success = true;
            transactionHash = hash;
            message = 'transaction successfully'
        })
        .on("error", err => {
            console.log(err.message)
        })
    
        return {
            success,
            transactionHash,
            message,
            code,
        }
    }catch(e){
        const error = e as ErrTransactionProps;
        message = error.message;
        code = error.code;

        return {
            success,
            transactionHash,
            message,
            code
        }
    }
}