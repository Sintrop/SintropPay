import axios from "axios";

export interface TransactionProps {
    blockHash: string;
    blockNumber: string;
    confirmations: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    from: string;
    gas: string;
    gasPrice: string;
    gasUsed: string;
    hash: string;
    input: string;
    nonce: string;
    timeStamp: string;
    to: string;
    tokenDecimal: string;
    tokenName: string;
    tokenSymbol: string;
    transactionIndex: string;
    value: string;
}

export async function GetTransactionsUser(address: string): Promise<TransactionProps[]>{
    const apiKey = import.meta.env.ETHERSCAN_API_KEY as string;

    const response = await axios.get(`https://api-sepolia.etherscan.io/api?module=account&action=tokentx&contractaddress=0xA8fDAbF07136c3c1A5C9572A730a2425c5a8500C&address=${address}&page=1&offset=100&startblock=0&endblock=27025780&sort=asc&apikey=${apiKey}`)
    const txlist = response.data.result as TransactionProps[];

    return txlist.reverse();
}