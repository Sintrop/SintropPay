export interface TransactionCheckoutProps {
    id: string;
    wallet: string;
    type: string;
    finished: boolean;
    discarded: boolean;
    additionalData: string;
    createdAt: string;
}