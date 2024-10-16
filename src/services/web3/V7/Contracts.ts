import Web3 from "web3";
import RCTokenJson from '../../../data/abis/V7/RcToken.json';
import SupporterContractJson from '../../../data/abis/V7/SupporterContract.json';

export const RCTokenAddress = '0xA173e03178E984bbA7913eE9C3664dDF9763f736';
export const supporterContractAddress = '0xf7fDF0b7A6fA93fAeCc9ff825da36E1AaDc681DA';

export const web3 = new Web3(window.ethereum);

export const RCTokenContract = new web3.eth.Contract(RCTokenJson, RCTokenAddress);
export const SupporterContract = new web3.eth.Contract(SupporterContractJson, supporterContractAddress);
