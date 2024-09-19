import { web3 } from "../services/web3/Contracts";

export function useValidityPaymentCode(paymentCode: string): boolean{
    if(!paymentCode.trim()){
        return true;
    }

    const split = paymentCode?.split('-');

    if(split.length !== 6){
        return false;
    }

    if(split){
        const wallet = split[0];
        const valueTransfer = split[1];
        const criptoTransfer = split[2];
        const originalValue = split[3];
        const calculationCurrency = split[4];
        const priceMoment = split[5];

        if(!web3.utils.isAddress(wallet)){
            return false
        }

        if(Number(valueTransfer) <= 0){
            return false;
        }

        if(criptoTransfer !== 'RC'){
            return false;
        }

        if(Number(originalValue) <= 0){
            return false
        }

        if(calculationCurrency !== 'BRL'){
            return false;
        }

        if(Number(priceMoment) <= 0){
            return false;
        }
    }


    return true;
}