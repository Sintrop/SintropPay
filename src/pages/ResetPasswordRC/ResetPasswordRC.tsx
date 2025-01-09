import { useEffect, useState } from "react";
import { GoBackButton } from "@/components/GoBackButton/GoBackButton";
import { useMainContext } from "@/hooks/useMainContext";
import { toast } from "react-toastify";
import { api } from "@/services/api";
import { useNetwork } from "@/hooks/useNetwork";
import { useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js';

const LOGIN_SECRET_PASS = import.meta.env.VITE_LOGIN_SECRET_PASS;
const LOGIN_SECURITY_KEY = import.meta.env.VITE_LOGIN_SECURITY_KEY;

export function ResetPasswordRC() {
    const { isSupported } = useNetwork();
    const { walletConnected } = useMainContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passNotMatch, setPassNotMatch] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (walletConnected === '') {
            navigate('/', { replace: true })
        }
        if (!isSupported) {
            navigate('/', { replace: true })
        }
    }, [walletConnected, isSupported]);

    useEffect(() => {
        if (password.length > 0 && confirmPassword.length > 0) {
            if (password !== confirmPassword) {
                setPassNotMatch(true);
            } else {
                setPassNotMatch(false);
            }
        } else {
            setPassNotMatch(false);
        }
    }, [password, confirmPassword]);

    useEffect(() => {
        getJWT();
    }, []);

    async function getJWT() {
        setLoading(true);
        const encrypt = CryptoJS.AES.encrypt(LOGIN_SECRET_PASS, LOGIN_SECURITY_KEY);

        try {
            const response = await api.post('/login/with-secure-key', {
                wallet: walletConnected,
                secureKey: encrypt.toString(),
            })

            if (response.data) {
                api.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;
            }
        } catch (err) {
            console.log('Error on storage user: ' + err);
            setIsError(true);
            setErrorMessage("Erro ao obter o token de segurança!");
        } finally {
            setLoading(false);
        }
    }

    function successReset(){
        toast.success("Senha redefinida com sucesso!");
        setPassword('');
        setConfirmPassword('');
    }

    async function handleChangePassword() {
        if (password.length < 6) {
            toast.error('A senha deve conter pelo menos 6 caracteres');
            return
        }

        if (!password.trim() || !confirmPassword.trim()) {
            toast.error('Preencha todos os campos');
            return
        }

        if (password !== confirmPassword) {
            toast.error('As senhas não conferem!')
            return;
        }

        try {
            setLoading(true);
            await api.put('/auth/update-password', {
                wallet: walletConnected,
                password
            })
            successReset();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    function getJwtAgain(){
        setIsError(false);
        setErrorMessage("");
        getJWT();
    }

    if (isError) {
        return (
            <main className="h-screen flex flex-col items-center justify-center bg-gradient-to-t from-[#1F5D38] to-[#043832]">
                <div className="flex flex-col h-full w-full lg:max-w-[420px] px-3 lg:border-2 border-white rounded-lg overflow-y-auto">
                    <div className='flex items-center gap-2 my-10'>
                        <GoBackButton />
                        <h1 className="text-white font-bold text-2xl">Recuperar senha</h1>
                    </div>

                    <p className="text-white font-semibold text-center mt-10">{errorMessage}</p>

                    <button
                        className="mt-10 h-12 w-full rounded-md bg-blue-primary text-white font-semibold flex items-center justify-center"
                        onClick={getJwtAgain}
                    >
                        Tentar novamente
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main className="h-screen flex flex-col items-center justify-center bg-gradient-to-t from-[#1F5D38] to-[#043832]">
            <div className="flex flex-col h-full w-full lg:max-w-[420px] px-3 lg:border-2 border-white rounded-lg overflow-y-auto">
                <div className='flex items-center gap-2 my-10'>
                    <GoBackButton />
                    <h1 className="text-white font-bold text-2xl">Recuperar senha</h1>
                </div>

                <p className="text-white">Recupere a senha do aplicativo do crédito de regeneração</p>
                <p className="text-white mt-5">Você está tentando redefinir a senha da conta associada a seguinte wallet:</p>
                <p className="text-white underline">{walletConnected}</p>

                <div className="flex flex-col mt-5">
                    <label className="text-white font-semibold">Digite sua nova senha</label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-12 px-3 rounded-md bg-container-primary text-white"
                        placeholder="Digite aqui"
                        type="password"
                    />

                    <label className="text-white font-semibold mt-5">Confirme a senha digitada</label>
                    <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-12 px-3 rounded-md bg-container-primary text-white"
                        placeholder="Digite aqui"
                        type="password"
                    />

                    {passNotMatch && (
                        <p className="text-red-500 mt-2">As senhas não estão iguais</p>
                    )}
                </div>

                <button
                    className="mt-10 h-12 w-full rounded-md bg-blue-primary text-white font-semibold flex items-center justify-center"
                    disabled={loading}
                    onClick={handleChangePassword}
                >
                    {loading ? (
                        <div className="w-5 h-5 bg-green-primary animate-spin" />
                    ) : (
                        'Redefinir senha'
                    )}
                </button>
            </div>
        </main>
    )
}