import { RCTokenContract } from "./Contracts";

interface SendTransactionProps{
    walletFrom: string;
    walletTo: string;
    value: number;
}

export async function SendTransaction({value, walletFrom, walletTo}: SendTransactionProps){
    await RCTokenContract.methods.transfer(walletTo, Number(value + '000000000000000000')).send({from: walletFrom})
    .on("confirmation", (receipt) =>
        console.log(receipt)
    )
    .on('transactionHash', hash => {
        console.log(hash)
    })
    .on("error", err => {
        console.log(err)
    });
}