import { api } from "../api";

interface CreatePubliProps{
    type: string;
    additionalData: string;
    userId?: string;
    walletConnected?: string;
}

export async function createPubliFeed(data: CreatePubliProps){
    const {additionalData, type, userId, walletConnected} = data;

    let userIdApi = '';

    if(userId){
        userIdApi = userId
    }else{
        if(walletConnected){
            const id = await getUserIdApi(walletConnected);
            userIdApi = id;
        }else{
            return;
        }
    }

    try{
        await api.post('/publication/new', {
            userId: userIdApi,
            type,
            origin: 'platform',
            additionalData,
        })
    }catch(e){
        console.log('erro to create publi in feed');
    }
}

async function getUserIdApi(wallet: string): Promise<string>{
    try{
        const response = await api.get(`/user/${wallet}`);
        return response.data.user.id;
    }catch(e){
        return '';
    }
}