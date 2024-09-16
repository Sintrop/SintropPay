import { Link } from "react-router-dom";

export function Sync() {
    return (
        <main className="h-screen flex flex-col items-center justify-center bg-gradient-to-t from-[#1F5D38] to-[#043832]">
            <div className="flex flex-col w-full lg:max-w-[1024px]">

                <h1 className="text-white font-bold text-5xl">Sintrop Pay</h1>

                <Link
                    className=" mt-20 bg-blue-primary w-[200px] h-10 items-center justify-center font-bold text-white rounded-md"
                    to='/dashboard'
                >
                    Sincronizar wallet
                </Link>

            </div>
        </main>
    )
}