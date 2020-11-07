const PredictionMarket = artifacts.require('PredictionMarket');

const Side = {
  Biden: 0,
  Trump: 1
};

module.exports = async function (deployer, _network, addresses) {
  const [admin, gambler1, gambler2, gambler3, gambler4, _] = addresses;
  console.log(`Deployment address: ${admin}`)
  console.log(`Gambler1 address: ${gambler1}`)
  console.log(`Gambler2 address: ${gambler2}`)
  console.log(`Gambler3 address: ${gambler3}`)
  console.log(`Gambler4 address: ${gambler4}`)

  await deployer.deploy(PredictionMarket, admin, admin);
  const predictionMarket = await PredictionMarket.deployed();
  await predictionMarket.placeBet(
    Side.Biden, 
    {from: gambler1, value: web3.utils.toWei('0.001')}
  );
  await predictionMarket.placeBet(
    Side.Biden, 
    {from: gambler2, value: web3.utils.toWei('0.001')}
  );
  await predictionMarket.placeBet(
    Side.Biden, 
    {from: gambler3, value: web3.utils.toWei('0.002')}
  );
  await predictionMarket.placeBet(
    Side.Trump, 
    {from: gambler4, value: web3.utils.toWei('0.001')}
  );
};