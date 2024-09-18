export interface PaymentDataProps{
    walletToSend: string;
    valueTransfer: number;
    criptoTransfer: string;
    originalValue: number;
    calculationCurrency: string;
    priceMoment: number;
}

export function SplitPaymentCode(paymentCode: string): PaymentDataProps | undefined{
    // Estrutura do código de pagamento
    // [WalletDestino]-[ValorParaTransferir]-[MoedaDeTransferência]-[ValorOriginal]-[MoedaDeCalculo]-[CotaçaoNoMomento];

    const split = paymentCode?.split('-');

    if(split){
        const wallet = split[0];
        const valueTransfer = split[1];
        const criptoTransfer = split[2];
        const originalValue = split[3];
        const calculationCurrency = split[4];
        const priceMoment = split[5];

        return({
            walletToSend: wallet,
            valueTransfer: Number(valueTransfer),
            criptoTransfer,
            calculationCurrency,
            originalValue: Number(originalValue),
            priceMoment: Number(priceMoment),
        })
    }
}