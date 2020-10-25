pragma solidity ^0.7.4;

contract PredictionMarket {

  enum Side {Biden, Trump}
  struct Result {
    Side winner;
    Side loser;
  }
  Result result;
  bool public electionFinished;
  mapping(Side => uint) public bets;
  mapping(address => mapping(Side => uint)) public betsPerGamblers;
  address public oracle;
  address payable public feeTo;
  uint fee;

  constructor(address _oracle, address payable _feeTo) {
    oracle = _oracle;
    feeTo = _feeTo;
  }

  function placeBet(Side _side) external payable {
    require(electionFinished == false, 'election is finishied');
    bets[_side] += msg.value * 995 / 1000;
    betsPerGamblers[msg.sender][_side] += msg.value * 995 / 1000;
    fee += msg.value * 5 / 1000;
  }

  function withdrawGain() external {
    uint gamblerBet = betsPerGamblers[msg.sender][result.winner];
    require(gamblerBet > 0, 'you do not have any winning bet');
    require(electionFinished == true, 'election is not finished');
    uint gain = gamblerBet + bets[result.loser] * gamblerBet / bets[result.winner];
    betsPerGamblers[msg.sender][Side.Biden] = 0;
    betsPerGamblers[msg.sender][Side.Trump] = 0;
    msg.sender.transfer(gain);
  }

  function withdrawFee() external {
    require(feeTo == msg.sender, 'only feeTo address can withdraw fee');
    feeTo.transfer(fee);
  }

  function reportRusult(Side _winner, Side _loser) external {
    require(oracle == msg.sender, 'only oracle can report');
    require(electionFinished == false, 'election is finished');
    result.winner = _winner;
    result.loser = _loser;
    electionFinished = true;
  }
}