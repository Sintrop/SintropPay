import { TransactionCheckoutProps } from "../../interfaces/transactionsCheckout";
import { UserApiProps } from "../../interfaces/user";
import { api } from "../api";
import { ReturnTransactionProps } from "../web3/V7/RCToken";
import { addSupporter } from "../web3/V7/Supporter";
import { createPubliFeed } from "./publicationFeed";
import { finishTransaction } from "./transactions";
import { getUserApi } from "./userApi";

interface ExecuteRegisterUserProps {
    transactionCheckoutData: TransactionCheckoutProps;
    walletConnected: string;
}

export async function executeRegisterUser(props: ExecuteRegisterUserProps): Promise<ReturnTransactionProps>{
    const {transactionCheckoutData, walletConnected} = props;

    const responseUser = await getUserApi(walletConnected);
    const user = responseUser.user;

    if(user.userType === 7){
        const responseWeb3 = await addSupporter({
            name: user.name,
            walletConnected,
        });

        if(responseWeb3.success){
            await afterRegisterBlockchain({
                transactionHash: responseWeb3.transactionHash,
                transactionId: transactionCheckoutData.id,
                userId: user.id,
                walletConnected
            });

            return responseWeb3;
        }else{
            return responseWeb3;
        }
    }

    return {
        code: 0,
        message: 'not user selected',
        success: false,
        transactionHash: ''
    }
}

interface AfterRegisterBlockchainProps{
    walletConnected: string;
    transactionId: string;
    transactionHash: string;
    userId: string;
}
async function afterRegisterBlockchain(props: AfterRegisterBlockchainProps){
    const {transactionHash, transactionId, userId, walletConnected} = props;

    await updateAccountStatus(walletConnected);
    await finishTransaction(transactionId);
    await createPubliFeed({
        type: 'new-user',
        userId,
        additionalData: JSON.stringify({hash: transactionHash}),
    })
}

async function updateAccountStatus(walletConnected: string){
    try{
        await api.put('/user/account-status', { userWallet: walletConnected, status: 'blockchain' })
    }catch(e){
        console.log('error on update account status');
    }
}