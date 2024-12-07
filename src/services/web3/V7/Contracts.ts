import Web3 from "web3";
import RCTokenJson from '../../../data/abis/V8/RcToken.json';
import SupporterContractJson from '../../../data/abis/V8/SupporterContract.json';
import InvitationContractJson from '../../../data/abis/V8/InvitationContract.json';
import SintropContractJson from '../../../data/abis/V8/Sintrop.json';
import ValidatorContractJson from '../../../data/abis/V8/ValidatorContract.json';
import ActivistContractJson from '../../../data/abis/V8/ActivistContract.json';
import DeveloperContractJson from '../../../data/abis/V8/DeveloperContract.json';
import InspectorContractJson from '../../../data/abis/V8/InspectorContract.json';
import ResearcherContractJson from '../../../data/abis/V8/ResearcherContract.json';
import ProducerContractJson from '../../../data/abis/V8/ProducerContract.json';

export const RCTokenAddress = '0x3708e3414c00118c8dfc43b4fF123aBef77232eD';
export const supporterContractAddress = '0x803C23b69f486e1d64e7b21Ab7D82FCE682f1cD1';
export const invitationContractAddress = '0x2706Aa94b6A9d34510D63C5A06A6cC6A44C66aF7';
export const sintropContractAddress = '0x999db64EC8fD02193eB1AE76E1B1e62Bf8de8880';
export const validatorContractAddress = '0x31B68Eb7598F74B2A983F90FDAA965AE7b5A0Cfe';
export const researcherContractAddress = '0x658C33911Fa10bb3191a2bff875D4529c0090568';
export const activistContractAddress = '0xa474B7F10d5E4bC9ba6A5842c3872097Eb80A680';
export const producerContractAddress = '0xd04E6EC25cc2f380f3BDb6778D2F5c1DAc91D254';
export const inspectorContractAddress = '0x32E079Cd3f860DF00d1ba2709E2367E55ab3Bd48';
export const developerContractAddress = '0x6962729da8025914831132d7c84F244fcbB5Bf33';
export const validatorPoolContractAddress = '0xf69C08EFDb98571e53AfF611FD8AB4Cd0cDEDDBb';
export const categoryContractAddress = '0x88a85094D01FF02153ffAECa80B815B15924b1F3';
export const activistPoolContractAddress = '0x923FCa43062DC1EcD30a888BFEAa2e084834c672';

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