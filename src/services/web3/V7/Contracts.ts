import Web3 from "web3";
import RCTokenJson from '../../../data/abis/V7/RcToken.json';
import SupporterContractJson from '../../../data/abis/V7/SupporterContract.json';
import InvitationContractJson from '../../../data/abis/V7/InvitationContract.json';
import SintropContractJson from '../../../data/abis/V7/Sintrop.json';
import ValidatorContractJson from '../../../data/abis/V7/ValidatorContract.json';
import ActivistContractJson from '../../../data/abis/V7/ActivistContract.json';
import DeveloperContractJson from '../../../data/abis/V7/DeveloperContract.json';
import InspectorContractJson from '../../../data/abis/V7/InspectorContract.json';
import ResearcherContractJson from '../../../data/abis/V7/ResearcherContract.json';
import ProducerContractJson from '../../../data/abis/V7/ProducerContract.json';

export const RCTokenAddress = '0xA173e03178E984bbA7913eE9C3664dDF9763f736';
export const supporterContractAddress = '0xf7fDF0b7A6fA93fAeCc9ff825da36E1AaDc681DA';
export const invitationContractAddress = '0x9A67E9EBbF7E8747c46b03faEa0757a2A4583FcF';
export const sintropContractAddress = '0x7560f7f50288797477884861c4e2AeA86810A31C';
export const validatorContractAddress = '0x7096412447E5e661d2906029858da85970e78B6d';
export const researcherContractAddress = '0x7497FaD7fab44D90928BdC36e642E8fc3720dE1B';
export const activistContractAddress = '0x2b5e7Dbb83678Ce109885bB02789E9e4fcD47F4F';
export const producerContractAddress = '0x2456D342DAAB50927E9034Bd6bA201B99e4F655c';
export const inspectorContractAddress = '0xE20aBb37B81C1FD54222Ce01eac4612ad5ecD7AC';
export const developerContractAddress = '0x4867A7EDfE41d909dcE80389F746d3a9d71844C0';
export const validatorPoolContractAddress = '0x3F8dE1A9d80c6A1dd1a35a439CB7FCC7Aa39Bf9A';
export const categoryContractAddress = '0x6C4F71C6f31F5D6afE97b30485149B7a9F7EAe8f';
export const activistPoolContractAddress = '0x587c92422162029f17aafFc8F3E87948c0B7A2fC';

export const web3 = new Web3(window.ethereum);

export const RCTokenContract = new web3.eth.Contract(RCTokenJson, RCTokenAddress);
export const SupporterContract = new web3.eth.Contract(SupporterContractJson, supporterContractAddress);
export const InvitationContract = new web3.eth.Contract(InvitationContractJson, invitationContractAddress);
export const SintropContract = new web3.eth.Contract(SintropContractJson, sintropContractAddress);
export const ValidatorContract = new web3.eth.Contract(ValidatorContractJson, validatorContractAddress);
export const ActivistContract = new web3.eth.Contract(ActivistContractJson, activistContractAddress);
export const InspectorContract = new web3.eth.Contract(InspectorContractJson, inspectorContractAddress);
export const DeveloperContract = new web3.eth.Contract(DeveloperContractJson, developerContractAddress);
export const ResearcherContract = new web3.eth.Contract(ResearcherContractJson, researcherContractAddress);
export const ProducerContract = new web3.eth.Contract(ProducerContractJson, producerContractAddress);