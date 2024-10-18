import { InvitationContract } from './Contracts';
import { web3RequestWrite } from '../requestService';
import { ReturnTransactionProps } from './RCToken';

interface InviteProps{
    walletConnected: string;
    walletToInvite: string;
    userType: number;
}
export async function invite({userType, walletConnected, walletToInvite}: InviteProps): Promise<ReturnTransactionProps>{
    const response = await web3RequestWrite(InvitationContract, 'invite', [walletToInvite, userType], walletConnected);
    return response;
}