import Web3 from "web3";
import RCTokenJson from '../../../data/abis/RcToken.json';

const RCTokenAddress = '0xA173e03178E984bbA7913eE9C3664dDF9763f736';

export const web3 = new Web3(window.ethereum);

export const RCTokenContract = new web3.eth.Contract(RCTokenJson, RCTokenAddress);
