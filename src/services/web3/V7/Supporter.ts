import {web3} from './Contracts';
import { SupporterContract } from "./Contracts";
import { ReturnTransactionProps } from "./RCToken";
import { web3RequestWrite } from '../requestService';

export async function BurnTokens(value: number, wallet: string): Promise<ReturnTransactionProps> {
    const valueWei = web3.utils.toWei(String(value), 'ether');
    const response = await web3RequestWrite(SupporterContract, 'burnTokens', [valueWei], wallet);
    return response;
}

interface AddSupporterProps{
    walletConnected: string;
    name: string;
}
export async function addSupporter(props: AddSupporterProps): Promise<ReturnTransactionProps>{
    const {name, walletConnected} = props;
    const response = await web3RequestWrite(SupporterContract, 'addSupporter', [name], walletConnected);
    return response;
}