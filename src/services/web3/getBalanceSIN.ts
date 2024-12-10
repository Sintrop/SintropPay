import { web3 } from '../web3/V7/Contracts';

export async function getBalanceSIN(wallet: string) {
    const response = await web3.eth.getBalance(wallet);
    const resBalance = Number(String(response).replace('n', ''));
    const balanceFormarterToEther = web3.utils.fromWei(resBalance, 'ether');
    
    return balanceFormarterToEther;
}
