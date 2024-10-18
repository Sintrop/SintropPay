import { TransactionCheckoutProps } from "../../interfaces/transactionsCheckout";
import { UserApiProps } from "../../interfaces/user";
import { api } from "../api";
import { BurnTokens, ReturnTransactionProps } from "../web3/V7/RCToken";
import { BurnTokens as BurnTokensSupporter} from '../web3/V7/Supporter';
import { finishTransaction } from "./transactions";

interface BurnTokensProps {
    transactionCheckoutData: TransactionCheckoutProps;
    walletConnected: string;
}

interface InvoiceProps {
    id: string
    userId: string
    month: number
    year: number
    ammountReceived: number
    impactTokenCarbon: number
    impactTokenWater: number
    impactTokenSoil: number
    impactTokenBio: number
    createdAt: string
}

interface AdditionalDataBurnTokensProps {
    value: number;
    invoiceData?: InvoiceProps;
    typePayment?: string;
}

export async function executeBurnTokens({ transactionCheckoutData, walletConnected }: BurnTokensProps): Promise<ReturnTransactionProps> {
    const responseUserApi = await api.get(`/user/${walletConnected}`);
    const user = responseUserApi.data.user as UserApiProps;

    let additionalData = {} as AdditionalDataBurnTokensProps;
    if (transactionCheckoutData?.additionalData) {
        additionalData = JSON.parse(transactionCheckoutData?.additionalData);
    }

    if (user?.userType === 7) {
        const responseWeb3 = await BurnTokensSupporter(additionalData.value, walletConnected);
        if (responseWeb3.success) {
            await finishTransaction(transactionCheckoutData.id, responseWeb3.transactionHash);
            await registerTokensApi(additionalData.value, responseWeb3.transactionHash, walletConnected, user);
            if (additionalData.invoiceData) {
                await attValuesInvoice(additionalData);
            }

            return responseWeb3;
        } else {
            return responseWeb3;
        }
    }

    const responseWeb3 = await BurnTokens(additionalData.value, walletConnected);
    if (responseWeb3.success) {
        await finishTransaction(transactionCheckoutData.id, responseWeb3.transactionHash);
        await registerTokensApi(additionalData.value, responseWeb3.transactionHash, walletConnected, user);
        if (additionalData.invoiceData) {
            await attValuesInvoice(additionalData);
        }

        return responseWeb3;
    } else {
        return responseWeb3;
    }
}

async function registerTokensApi(tokens: number, hash: string, walletConnected: string, userApi: UserApiProps) {
    const responseImpact = await api.get('/impact-per-token');
    const impactToken = responseImpact.data.impact;

    const addDataPubli = {
        tokens: tokens,
        transactionHash: hash,
        hash,
    }

    try {
        await api.post('/tokens-burned', {
            wallet: walletConnected.toUpperCase(),
            tokens: Number(tokens),
            transactionHash: hash,
            carbon: Number(impactToken?.carbon),
            water: Number(impactToken?.water),
            bio: Number(impactToken?.bio),
            soil: Number(impactToken?.soil)
        });

        await api.post('/publication/new', {
            userId: userApi?.id,
            type: 'contribute-tokens',
            origin: 'platform',
            additionalData: JSON.stringify(addDataPubli),
        });
    } catch (err) {
        console.log(err);
    }
}

async function attValuesInvoice(additionalData: AdditionalDataBurnTokensProps) {
    if (additionalData?.typePayment === 'partial') {
        const response = await api.get(`/invoice/${additionalData?.invoiceData?.id}`);
        const ammountReceived = response.data.invoice?.ammountReceived;
        const newAmmount = ammountReceived + Number(additionalData?.value);

        try {
            await api.put('/invoice', {
                invoiceId: response.data.invoice?.id,
                ammountReceived: Number(newAmmount)
            })
        } catch (err) {
            console.log(err);
        }
    }

    if (additionalData?.typePayment === 'total') {
        const response = await api.get('/impact-per-token');
        const impact = response.data.impact;

        try {
            await api.put('/invoice', {
                invoiceId: additionalData?.invoiceData?.id,
                ammountReceived: Number(additionalData?.value),
                impactTokenCarbon: impact?.carbon,
                impactTokenWater: impact?.water,
                impactTokenSoil: impact?.soil,
                impactTokenBio: impact?.bio,
            })
        } catch (err) {
            console.log(err);
        }
    }
}