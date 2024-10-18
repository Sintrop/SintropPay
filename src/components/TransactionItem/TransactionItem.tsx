import { useEffect, useState } from "react";
import { TransactionProps } from "../../services/GetTransactionsUser"
import { useMainContext } from "../../hooks/useMainContext";
import { web3 } from "../../services/web3/V7/Contracts";
import { format } from "date-fns";
import { Icon } from "../Icon/Icon";

interface Props {
    data: TransactionProps;
}

export function TransactionItem({ data }: Props) {
    const { walletConnected } = useMainContext();
    const [revenue, setRevenue] = useState(true);

    useEffect(() => {
        checkRevenue();
    }, []);

    function checkRevenue() {
        if (data.from.toUpperCase() === walletConnected.toUpperCase()) {
            setRevenue(false);
        }
    }

    return (
        <div
            className="flex flex-col justify-between p-3 rounded-md bg-container-primary"
        >
            <p className="text-xs text-gray-400">
                {format(new Date(Number(data?.timeStamp) * 1000), 'dd/MM/yyyy - kk:mm')}
            </p>
            <div className="flex items-center gap-5 w-full mt-2">
                <Icon name={revenue ? 'arrowDown': 'arrowUp'} color={revenue ? 'green' : 'red'}/>

                <div className="flex flex-col w-[85%]">
                    <p className="font-bold text-white text-sm">
                        {revenue ? 'Você recebeu de' : 'Você transferiu para'}
                    </p>

                    <p className="text-white text-sm truncate">
                        {revenue ? data.from : data.to}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-1 mt-3">
                <p className="text-white ">Valor</p>
                <p className="font-bold text-green-primary">
                    {Number(web3.utils.fromWei(data.value, 'ether')).toFixed(5)} RC
                </p>
            </div>
        </div>
    )
}