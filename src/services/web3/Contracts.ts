import Web3 from "web3";
import RCTokenJson from '../../data/abis/RcToken.json';

const RCTokenAddress = '0xA8fDAbF07136c3c1A5C9572A730a2425c5a8500C';

const web3 = new Web3(window.ethereum);

export const RCTokenContract = new web3.eth.Contract(RCTokenJson, RCTokenAddress);
