import Web3 from "web3";
import RCTokenJson from '../../../data/abis/V7/RcToken.json';
import SupporterContractJson from '../../../data/abis/V7/SupporterContract.json';
import InvitationContractJson from '../../../data/abis/V7/InvitationContract.json';
import SintropContractJson from '../../../data/abis/V7/Sintrop.json';

export const RCTokenAddress = '0xA173e03178E984bbA7913eE9C3664dDF9763f736';
export const supporterContractAddress = '0xf7fDF0b7A6fA93fAeCc9ff825da36E1AaDc681DA';
export const invitationContractAddress = '0x9A67E9EBbF7E8747c46b03faEa0757a2A4583FcF';
export const sintropContractAddress = '0x7560f7f50288797477884861c4e2AeA86810A31C';

export const web3 = new Web3(window.ethereum);

export const RCTokenContract = new web3.eth.Contract(RCTokenJson, RCTokenAddress);
export const SupporterContract = new web3.eth.Contract(SupporterContractJson, supporterContractAddress);
export const InvitationContract = new web3.eth.Contract(InvitationContractJson, invitationContractAddress);
export const SintropContract = new web3.eth.Contract(SintropContractJson, sintropContractAddress);