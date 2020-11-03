const PredictionMarket = artifacts.require('PredictionMarket.sol');

const SIDE = {
  BIDEN: 0,
  TRUMP: 1
}

contract('PredictionMarket', (addresses) => {
  const [admin, oracle, gambler1, gambler2, gambler3, gambler4, ..._] = addresses;

  it('should work', async () => {
    const predictionMarket = await PredictionMarket.new(oracle, admin);

    await predictionMarket.placeBet(
      SIDE.BIDEN,
      {from: gambler1, value: web3.utils.toWei('1')}
    );

    await predictionMarket.placeBet(
      SIDE.BIDEN,
      {from: gambler2, value: web3.utils.toWei('1')}
    );

    await predictionMarket.placeBet(
      SIDE.BIDEN,
      {from: gambler3, value: web3.utils.toWei('2')}
    );

    await predictionMarket.placeBet(
      SIDE.TRUMP,
      {from: gambler4, value: web3.utils.toWei('4')}
    );

    await predictionMarket.reportResult(
      SIDE.BIDEN,
      SIDE.TRUMP,
      {from: oracle}
    );

    const balanceBefore = (await Promise.all(
      [gambler1, gambler2, gambler3, gambler4].map(gambler => (
        web3.eth.getBalance(gambler)
      ))
    ))
    .map(balance => web3.utils.toBN(balance));

    await Promise.all(
      [gambler1, gambler2, gambler3].map(gambler => (
        predictionMarket.withdrawGain({from: gambler})
      ))
    );

    const balanceAfter = (await Promise.all(
      [gambler1, gambler2, gambler3, gambler4].map(gambler => (
        web3.eth.getBalance(gambler)
      ))
    ))
    .map(balance => web3.utils.toBN(balance));

    const adminBalanceBefore = web3.utils.toBN(await web3.eth.getBalance(admin));
    await predictionMarket.withdrawFee({from: admin});
    const adminBalanceAfter = web3.utils.toBN(await web3.eth.getBalance(admin));

    const winAmount = Array(3).fill(0);
    for(let i=0; i<3; i++) {
      winAmount[i] = balanceAfter[i].sub(balanceBefore[i]).toString();
    }
    assert(winAmount[0].length === 19 && winAmount[0].slice(0, 3) === '198');
    assert(winAmount[1].length === 19 && winAmount[1].slice(0, 3) === '198');
    assert(winAmount[2].length === 19 && winAmount[2].slice(0, 3) === '397');
    assert(balanceAfter[3].sub(balanceBefore[3]).isZero());

    const fee = adminBalanceAfter.sub(adminBalanceBefore).toString();
    assert(fee.length === 17 && fee.slice(0,2) === '39'); 
  });
});