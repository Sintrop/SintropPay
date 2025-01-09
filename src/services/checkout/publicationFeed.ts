interface CreatePubliProps{
    type: string;
    additionalData: string;
    userId?: string;
    walletConnected?: string;
}

export async function createPubliFeed(data: CreatePubliProps){
    console.log(data);
    return true;
}