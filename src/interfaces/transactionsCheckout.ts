export interface TransactionCheckoutProps {
    id: string;
    wallet: string;
    type: string;
    finished: boolean;
    discarded: boolean;
    transactionHash: string;
    additionalData: string;
    createdAt: string;
    finishedAt: string;
}