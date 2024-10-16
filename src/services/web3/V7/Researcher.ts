import { ResearcherContract } from "./Contracts";
import { web3RequestWrite } from "../requestService";
import { ReturnTransactionProps } from "./RCToken";

interface AddResearcherProps{
    walletConnected: string;
    name: string;
    proofPhoto: string;
}
export async function addResearcher(props: AddResearcherProps): Promise<ReturnTransactionProps>{
    const {name, proofPhoto, walletConnected} = props;
    const response = await web3RequestWrite(ResearcherContract, 'addResearcher', [name, proofPhoto], walletConnected);
    return response;
}