const { network } = require("hardhat")

const {
  DECIMALS,
  INITIAL_ANSWER,
  developmentChains,
} = require("../helper-hardhat-config.js")

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  if (developmentChains.includes(network.name)) {
    log("Local network detected! Deploying mocks ...")
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    })
    log("Mocks deployed!")
    log("----------------------------------------------")
  }
}

module.exports.tags = ["all", "mocks"]
