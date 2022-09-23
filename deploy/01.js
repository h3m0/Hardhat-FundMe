const { hre, ethers }  = require('hardhat');
const { LOCAL, DECIMALS, STARTING_VALUE } = require('../hasbi')

module.exports = async ({ deployments, getNamedAccounts }) => {
  let CONSTRUCTORARG;

  const { deploy, log } = deployments
  const { deployer }  = await getNamedAccounts();

  if (LOCAL.includes(network.config.chainId)) {
    log("Local network detected! deploying mocks...")
    log("==================================================")
     const mcontract = await deploy("MockV3Aggregator",
      {
        from: deployer,
        args: [DECIMALS, STARTING_VALUE],
        log: true
      }
    )
    CONSTRUCTORARG = mcontract.address;
    log("===================================================")
    log(`Mocks deployed! at : ${mcontract.address}`)
  } else {
    CONSTRUCTORARG = network.config.ethUsdPricefeed;
  }
  log("Deploying Contract...")
  log("====================================")
  const FundMe = await deploy("FundMe",
    {
      from: deployer,
      args: [CONSTRUCTORARG],
      log: true
    }
  )
  
  log(`Contract deployed!! : ${FundMe.address}`);

  // log("Funding....")
  // const sendValue = await ethers.utils.parseEther("1")
  // const FUNDME = await ethers.getContract("FundMe");
  // const MOCK = await ethers.getContract("MockV3Aggregator")
  // const tx = await FUNDME.fund(
  //   {
  //     from: deployer,
  //     value: sendValue
  //   }
  // )
  // tx.wait(1);
  // log("Funded!!")
  // log(FUNDME)
  //
  // log("testing for priceFeed")
  // const rr = await FUNDME.check()
  // if (rr == MOCK.address) {
  //   log("This test passed")
  // } else {
  //   log("This test did not pass")
  //   log(FUNDME.check())
  //   log(MOCK.address)
  // }
}

module.exports.tags = ["all"]
