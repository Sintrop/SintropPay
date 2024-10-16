import { TransactionCheckoutProps } from "../../interfaces/transactionsCheckout";
import { invite } from "../web3/V7/Invitation";
import { ReturnTransactionProps } from "../web3/V7/RCToken";
import { createPubliFeed } from "./publicationFeed";
import { finishTransaction } from "./transactions";

interface AdditionalDataInviteProps {
    userWallet: string;
    userType: number;
}

interface ExecuteInviteProps {
    transactionCheckoutData: TransactionCheckoutProps;
    walletConnected: string;
}
export async function executeInvite(data: ExecuteInviteProps): Promise<ReturnTransactionProps> {
    const { transactionCheckoutData, walletConnected } = data;

    let additionalData = {} as AdditionalDataInviteProps;
    if (transactionCheckoutData?.additionalData) {
        additionalData = JSON.parse(transactionCheckoutData?.additionalData);
    }

    const responseWeb3 = await invite({
        userType: additionalData.userType,
        walletToInvite: additionalData.userWallet,
        walletConnected
    });

    if (responseWeb3.success) {
        const addDataPubli = {
            hash: responseWeb3.transactionHash,
            walletInvited: additionalData?.userWallet,
            userType: additionalData?.userType,
        }

        await finishTransaction(transactionCheckoutData.id);
        await createPubliFeed({
            additionalData: JSON.stringify(addDataPubli),
            type: 'invite-wallet',
            walletConnected
        });

        return responseWeb3;
    } else {
        return responseWeb3;
    }
}