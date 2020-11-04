import React, { useState, useEffect } from 'react';
import getBlockchain from './ethereum';

const SIDE = {
  BIDEN: 0,
  TRUMP: 1
}

function App() {
  const [ predictionMarket, setPredictionMarket] = useState(undefined);
  const [myBets, setMyBets] = useState(undefined);

  // 跟旧的api componentDidMount类似。
  // 第二个参数的state发生变化的话，触发第一个参数的回调函数。
  // 如果是空就执行一次。
  useEffect( () => {
    const init = async () => {
      const { signerAddress, predictionMarket} = await getBlockchain();
      const myBets = await Promise.all([
        predictionMarket.betsPerGambler(signerAddress, SIDE.BIDEN),
        predictionMarket.betsPerGambler(signerAddress, SIDE.TRUMP),
      ])
      setPredictionMarket(predictionMarket);
      setMyBets(myBets);
    };
    init();
  }, []);

  if (
    typeof predictionMarket === 'undefined' 
    || typeof myBets === 'undefined'
  ) {
    return 'Loading...';
  } 
  return (
    <div className='container'>

      <div className='row'>
        <div className='col-sm-12'>
          <h1 className='text-center'>Prediction Market
          <div className='jumbotron'>
            <h1 className='display-4 text-center'>Who will win the US election?</h1>
          </div>
          </h1>
        </div>
      </div>
      
    </div>
  );
  
}

export default App;
