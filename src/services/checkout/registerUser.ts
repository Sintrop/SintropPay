import { TransactionCheckoutProps } from "../../interfaces/transactionsCheckout";
import { api } from "../api";
import { addActivist } from "../web3/V7/Activist";
import { addDeveloper } from "../web3/V7/Developer";
import { addInspector } from "../web3/V7/Inspector";
import { ReturnTransactionProps } from "../web3/V7/RCToken";
import { addResearcher } from "../web3/V7/Researcher";
import { addSupporter } from "../web3/V7/Supporter";
import { addValidator } from "../web3/V7/Validator";
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
    if(!user.name && user.userType !== 8){
        return {
            code: 0,
            message: 'not user selected',
            success: false,
            transactionHash: ''
        }
    }

    if(user.userType === 2){
        const responseAddInspector = await addInspector({
            name: user.name,
            proofPhoto: user.imgProfileUrl,
            walletConnected,
        });

        if(responseAddInspector.success){
            await afterRegisterBlockchain({
                transactionHash: responseAddInspector.transactionHash,
                transactionId: transactionCheckoutData.id,
                userId: user.id,
                walletConnected
            });

            return responseAddInspector;
        }else{
            return responseAddInspector;
        }
    }

    if(user.userType === 3){
        const responseAddResearcher = await addResearcher({
            name: user.name,
            proofPhoto: user.imgProfileUrl,
            walletConnected,
        });

        if(responseAddResearcher.success){
            await afterRegisterBlockchain({
                transactionHash: responseAddResearcher.transactionHash,
                transactionId: transactionCheckoutData.id,
                userId: user.id,
                walletConnected
            });

            return responseAddResearcher;
        }else{
            return responseAddResearcher;
        }
    }

    if(user.userType === 4){
        const responseAddDeveloper = await addDeveloper({
            name: user.name,
            proofPhoto: user.imgProfileUrl,
            walletConnected,
        });

        if(responseAddDeveloper.success){
            await afterRegisterBlockchain({
                transactionHash: responseAddDeveloper.transactionHash,
                transactionId: transactionCheckoutData.id,
                userId: user.id,
                walletConnected
            });

            return responseAddDeveloper;
        }else{
            return responseAddDeveloper;
        }
    }

    if(user.userType === 6){
        const responseAddActivist = await addActivist({
            name: user.name,
            proofPhoto: user.imgProfileUrl,
            walletConnected,
        });

        if(responseAddActivist.success){
            await afterRegisterBlockchain({
                transactionHash: responseAddActivist.transactionHash,
                transactionId: transactionCheckoutData.id,
                userId: user.id,
                walletConnected
            });

            return responseAddActivist;
        }else{
            return responseAddActivist;
        }
    }

    if(user.userType === 7){
        const responseAddSupporter = await addSupporter({
            name: user.name,
            walletConnected,
        });

        if(responseAddSupporter.success){
            await afterRegisterBlockchain({
                transactionHash: responseAddSupporter.transactionHash,
                transactionId: transactionCheckoutData.id,
                userId: user.id,
                walletConnected
            });

            return responseAddSupporter;
        }else{
            return responseAddSupporter;
        }
    }

    if(user.userType === 8){
        const responseAddValidator = await addValidator(walletConnected);

        if(responseAddValidator.success){
            await afterRegisterBlockchain({
                transactionHash: responseAddValidator.transactionHash,
                transactionId: transactionCheckoutData.id,
                userId: user.id,
                walletConnected
            });

            return responseAddValidator;
        }else{
            return responseAddValidator;
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