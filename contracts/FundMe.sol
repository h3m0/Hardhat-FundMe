//SPDX-License-Identifier: MIT
pragma solidity >=0.6.6 <0.9.0;
import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
// 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e

contract FundMe{
    address payable owner;
    mapping(address => uint256) public addrtoamnt;
    address[] public funders;
    AggregatorV3Interface internal priceFeed;

    constructor(address _addr) public{
        owner = payable(msg.sender);
        priceFeed = AggregatorV3Interface(_addr);
    }

    function getPrice() public view returns(uint256){
        (,int256 answer,,,) = priceFeed.latestRoundData();
        return uint256(answer) / 10 ** 8;
    }

    function ETHtoUSD(uint256 _eth) public view returns(uint256){
        uint256 convertedeth = getPrice() * _eth;
        return convertedeth / 1000000000000000000;
    }

    function fund() payable public {
        uint256 fee = 50;
        require(ETHtoUSD(msg.value) >= fee, "You need to spend more eth");
        owner.transfer(msg.value);
        funders.push(msg.sender);
        addrtoamnt[msg.sender] = msg.value;
    }

     modifier onlyOwner {
    	require(msg.sender == owner, "Not owner");
        _;
    }
    function checkfal() public view returns(uint256){
      uint256 thing = funders.length;
      return thing;
    }

    function checkpfa() public view returns(AggregatorV3Interface){
      return priceFeed;
    }

    function withdraw() payable public onlyOwner{
       payable(msg.sender).transfer(address(this).balance);
       for(uint i = 0; i < funders.length; i++){
           address funder = funders[i];
           addrtoamnt[funder] = 0;
       }
        funders = new address[](0);
    }
}
