require("dotenv").config()
const { network } = require("hardhat")

const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config.js")
const { verify } = require("../utils/verify.js")


module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  const chainId = network.config.chainId
  let ethUsdPriceFeedAddress
  if (chainId == 31337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator")
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  }

  // if chainId is X use address Y
  // if chainId is Z use address P

  const args = [ethUsdPriceFeedAddress]

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args, // address to the contract to get ETH / USD
    log: true,
    waitConformations: network.config.blockConformation || 1,
  })

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args)
  } 
  log("-------------------")
}

module.exports.tags = ["all", "fundMe"]
