import {web3} from './Contracts';
import { SupporterContract } from "./Contracts";
import { ReturnTransactionProps } from "./RCToken";
import { web3RequestWrite } from '../requestService';

export async function BurnTokens(value: number, wallet: string): Promise<ReturnTransactionProps> {
    const valueWei = web3.utils.toWei(String(value), 'ether');
    const response = await web3RequestWrite(SupporterContract, 'burnTokens', [valueWei], wallet);
    return response;
}