import { TransactionCheckoutProps } from "../../interfaces/transactionsCheckout";
import { ReturnTransactionProps } from "../web3/V7/RCToken";
import { getUserApi } from "./userApi";
import { finishTransaction } from "./transactions";
import { createPubliFeed } from "./publicationFeed";
import { withdraw as withdrawProducer } from "../web3/V7/Producer";
import { withdraw as withdrawInspector } from "../web3/V7/Inspector";
import { withdraw as withdrawResearcher } from "../web3/V7/Researcher";
import { withdraw as withdrawDeveloper } from "../web3/V7/Developer";
import { withdraw as withdrawActivist } from "../web3/V7/Activist";
import { withdraw as withdrawValidator } from "../web3/V7/Validator";

interface ExecuteWithdrawProps {
    transactionCheckoutData: TransactionCheckoutProps;
    walletConnected: string;
}

export async function executeWithdraw(props: ExecuteWithdrawProps): Promise<ReturnTransactionProps>{
    const {transactionCheckoutData, walletConnected} = props;

    const response = await getUserApi(walletConnected);
    if(!response.success){
        return{
            code: 500,
            message: 'error on get user api',
            success: false,
            transactionHash: ''
        }
    }

    const user = response.user;

    if(user.userType === 1){
        const responseWithdrawProducer = await withdrawProducer(walletConnected);
        if(responseWithdrawProducer.success){
            await afterWithdraw({
                transactionHash: responseWithdrawProducer.transactionHash,
                transactionId: transactionCheckoutData.id,
                userId: user.id,
            })
            return responseWithdrawProducer;
        }

        return responseWithdrawProducer;
    }

    if(user.userType === 2){
        const responseWithdrawInspector = await withdrawInspector(walletConnected);
        if(responseWithdrawInspector.success){
            await afterWithdraw({
                transactionHash: responseWithdrawInspector.transactionHash,
                transactionId: transactionCheckoutData.id,
                userId: user.id,
            })
            return responseWithdrawInspector;
        }

        return responseWithdrawInspector;
    }

    if(user.userType === 3){
        const responseWithdrawResearcher = await withdrawResearcher(walletConnected);
        if(responseWithdrawResearcher.success){
            await afterWithdraw({
                transactionHash: responseWithdrawResearcher.transactionHash,
                transactionId: transactionCheckoutData.id,
                userId: user.id,
            })
            return responseWithdrawResearcher;
        }

        return responseWithdrawResearcher;
    }

    if(user.userType === 4){
        const responseWithdrawDeveloper = await withdrawDeveloper(walletConnected);
        if(responseWithdrawDeveloper.success){
            await afterWithdraw({
                transactionHash: responseWithdrawDeveloper.transactionHash,
                transactionId: transactionCheckoutData.id,
                userId: user.id,
            })
            return responseWithdrawDeveloper;
        }

        return responseWithdrawDeveloper;
    }

    if(user.userType === 5){
        return{
            code: 500,
            message: 'withdraw not avaliable for contributor',
            success: false,
            transactionHash: ''
        }
    }

    if(user.userType === 6){
        const responseWithdrawActivist = await withdrawActivist(walletConnected);
        if(responseWithdrawActivist.success){
            await afterWithdraw({
                transactionHash: responseWithdrawActivist.transactionHash,
                transactionId: transactionCheckoutData.id,
                userId: user.id,
            })
            return responseWithdrawActivist;
        }

        return responseWithdrawActivist;
    }

    if(user.userType === 8){
        const responseWithdrawValidator = await withdrawValidator(walletConnected);
        if(responseWithdrawValidator.success){
            await afterWithdraw({
                transactionHash: responseWithdrawValidator.transactionHash,
                transactionId: transactionCheckoutData.id,
                userId: user.id,
            })
            return responseWithdrawValidator;
        }

        return responseWithdrawValidator;
    }

    return{
        code: 500,
        message: 'error on execute withdraw',
        success: false,
        transactionHash: ''
    }
}

interface AfterWithdrawProps{
    transactionId: string;
    userId: string;
    transactionHash: string;
}
async function afterWithdraw(props: AfterWithdrawProps){
    const {transactionId, userId, transactionHash} = props;

    await finishTransaction(transactionId, transactionHash);
    await createPubliFeed({
        type: 'withdraw-tokens',
        userId,
        additionalData: JSON.stringify({hash: transactionHash, transactionHash})
    })
}