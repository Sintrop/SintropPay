import { useEffect, useState } from "react";
import useSWR from "swr";
import Web3 from "web3";
const NETWORKS = {
  1: "Ethereum Main Network",
  3: "Ropsten Test Network",
  4: "Rinkeby Test Network",
  5: "Goerli Test Network",
  42: "Kovan Test Network",
  56: "Binance Smart Chain",
  5777: "Ganache",
  11155111: "Sepolia Test Network",
  17000: "Holesky Test Network",
  1600: "Sequoia Test Network",
};
const targetNetwork = NETWORKS["1600"];
export const useNetwork = () => {
  const [supportedNetwork, setSupportedNetwork] = useState(true);

  const web3 = new Web3(window.ethereum);
  // window.ethereum.on("chainChanged", (_chainId) => {
  //   console.log(parseInt(_chainId, 16));
  // });
  const { data, ...rest } = useSWR(
    () => (web3 ? "web3/network" : null),
    async () => {
      const chainId = await web3.eth.net.getId();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      return NETWORKS[chainId];
    }
  );
  
  useEffect(() => {
    if(data){
      if(data === targetNetwork){
        setSupportedNetwork(true);
      }else{
        setSupportedNetwork(false);
      }
    }
  }, [data]);

  return {
    data,
    target: targetNetwork,
    isSupported: supportedNetwork,
    ...rest,
  };
};
