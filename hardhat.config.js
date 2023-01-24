require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
require("hardhat-gas-reporter")
require("dotenv").config()


module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: [ process.env.PRIVATE_KEY1, process.env.PRIVATE_KEY2 ],
      chainId: 5,
      blockConformations: 6,
      gas: 2100000,
      gasPrice: 8000000000,
    },
    localhost: {
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },

  solidity: {
    compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    },
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "ETH",
    token: "MATIC",
  }, 
};
