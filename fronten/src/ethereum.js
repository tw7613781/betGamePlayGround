import { ethers, Contract} from 'ethers'
import PredictionMarket from './contracts/PredictionMarket.json';

const getBlockchain = () => new Promise( (resolve, reject) => {
  window.addEventListener('load', async () => {
    if(window.ethereum) {
      await window.ethereum.enable(); // metamask注入到浏览器window对象下的ethereum对象。
      const provider = new ethers.providers.Web3Provider(window.ethereum); // 让metamsk当provider的话，provider就是个钱包，提供了私钥
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();

      const predictionMarket = new Contract(
        PredictionMarket.networks(window.ethereum.networkVersion).address,  //从metamask处获得eth网络id，然后从部署了之后的合约处获得其在对应网络的部署地址
        PredictionMarket.abi, //合约的接口文件
        signer
      );

      resolve({signerAddress, predictionMarket});
    }
  })
});

export default getBlockchain;