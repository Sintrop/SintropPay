import { toast } from "react-toastify";
import { useMainContext } from "../../hooks/useMainContext";
import { useNavigate } from "react-router-dom";

export function Sync() {
    const navigate = useNavigate();
    const {syncWallet} = useMainContext();

    async function handleSyncWallet(){
        const response = await syncWallet();
        if(response.success){
            navigate('/dashboard');
        }else{
            toast.error('Falha ao tentar sincronizar sua wallet');
        }
    }

    return (
        <main className="h-screen flex flex-col items-center justify-center bg-gradient-to-t from-[#1F5D38] to-[#043832]">
            <div className="flex flex-col w-full lg:max-w-[420px]">

                <h1 className="text-white font-bold text-5xl">Sintrop Pay</h1>

                <button
                    className=" mt-20 bg-blue-primary w-[200px] h-10 items-center justify-center font-bold text-white rounded-md"
                    onClick={handleSyncWallet}
                >
                    Sincronizar wallet
                </button>

            </div>
        </main>
    )
}