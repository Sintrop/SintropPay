import { Link } from "react-router-dom";

export function Home(){

    return(
        <main className="h-screen flex flex-col items-center justify-center bg-gradient-to-t from-[#1F5D38] to-[#043832]">
            <div className="flex flex-col w-full lg:max-w-[1024px]">
                
                        <h1 className="text-white font-bold text-5xl">Sintrop Pay</h1>

                        <div className="flex mt-20 gap-5 flex-wrap">
                            <Link
                                className="w-[150px] h-[150px] bg-container-primary rounded-md p-3 shadow-lg flex flex-col justify-between"
                                to='/send'
                            >
                                <div className="w-10 h-10 bg-red-400"/>

                                <p className="font-bold text-white">Pagar</p>
                            </Link>

                            <Link
                                className="w-[150px] h-[150px] bg-container-primary rounded-md p-3 shadow-lg flex flex-col justify-between"
                                to='/receive'
                            >
                                <div className="w-10 h-10 bg-red-400"/>

                                <p className="font-bold text-white">Cobrar</p>
                            </Link>

                            <button
                                className="w-[150px] h-[150px] bg-container-primary rounded-md p-3 shadow-lg flex flex-col justify-between"
                            >
                                <div className="w-10 h-10 bg-red-400"/>

                                <p className="font-bold text-white">Minhas transações</p>
                            </button>

                            <button
                                className="w-[150px] h-[150px] bg-container-primary rounded-md p-3 shadow-lg flex flex-col justify-between"
                            >
                                <div className="w-10 h-10 bg-red-400"/>

                                <p className="font-bold text-white">Checkout Crédito de Regeneração</p>
                            </button>
                        </div>
                    
            </div>
        </main>
    )
}