import { UserApiProps } from "../../interfaces/user";
import { api } from "../api";

interface ReturnGetUserProps{
    success: boolean;
    user: UserApiProps;
}
export async function getUserApi(walletConnected: string): Promise<ReturnGetUserProps>{
    try{
        const response = await api.get(`/user/${walletConnected}`);
        return {
            success: true,
            user: response.data.user,
        }
    }catch(e){
        console.log('error on get user data api');
        return {
            success: false,
            user: {} as UserApiProps,
        }
    }
}