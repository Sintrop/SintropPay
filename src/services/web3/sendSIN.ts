import { web3 } from "./V7/Contracts";
import { ReturnTransactionProps } from "./V7/RCToken";

interface SendSINProps {
    to: string;
    walletConnected: string;
    value: number;
}
export async function sendSIN({ to, value, walletConnected }: SendSINProps): Promise<ReturnTransactionProps> {
    let code = 0;
    let message = '';
    let transactionHash = '';
    let success = false;

    const valueToWei = web3.utils.toWei(value, 'ether');
    await web3.eth.sendTransaction({
        to,
        from: walletConnected,
        value: valueToWei,
        gasPrice: 100000
    })
        .then((hash) => {
            if (hash) {
                transactionHash = hash.transactionHash.toString();
                success = true;
                message = "send success";
                code = 200;
            }

        })
        .catch(err => {
            console.log(err);
            transactionHash = ''
            success = false;
            message = "error to send payment";
            code = 500;
        });

    return {
        code,
        message,
        success,
        transactionHash
    }
}