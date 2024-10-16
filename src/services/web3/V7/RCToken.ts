import { web3RequestWrite } from "../requestService";
import { RCTokenContract } from "./Contracts";
import { web3 } from './Contracts';

export interface ReturnTransactionProps {
    transactionHash: string;
    success: boolean;
    message: string;
    code: number;
}

interface ErrTransactionProps {
    code: number;
    message: string;
}

interface SendTransactionProps {
    walletFrom: string;
    walletTo?: string;
    value?: number;
}
export async function SendTransaction({ value, walletFrom, walletTo }: SendTransactionProps): Promise<ReturnTransactionProps> {
    let success = false;
    let transactionHash = '';
    let message = 'error';
    let code = 0;

    const valueWei = web3.utils.toWei(String(value), 'ether');

    try {
        await RCTokenContract.methods.transfer(walletTo, valueWei).send({ from: walletFrom })
            .on('transactionHash', hash => {
                success = true;
                transactionHash = hash;
                message = 'transaction successfully'
            })
            .on("error", (err) => {
                console.log(err.message)
            })

        return {
            success,
            transactionHash,
            message,
            code,
        }
    } catch (e) {
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

export async function GetBalanceRC(address: string): Promise<string> {
    try {
        const response = await RCTokenContract.methods.balanceOf(address).call();
        const resBalance = Number(String(response).replace('n', ''));
        const balanceFormarterToEther = web3.utils.fromWei(resBalance, 'ether');

        return balanceFormarterToEther
    } catch (e) {
        return '0';
    }
}

export async function BurnTokens(value: number, wallet: string): Promise<ReturnTransactionProps> {
    const valueWei = web3.utils.toWei(String(value), 'ether');
    const response = await web3RequestWrite(RCTokenContract, 'burnTokens', [valueWei], wallet);
    return response;
}