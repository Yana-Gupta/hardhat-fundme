const { ethers, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config.js")

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      let fundMe
      let deployer
      const sendEth = ethers.utils.parseEther("0.01")
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        fundMe = await ethers.getContract("FundMe", deployer)
      })

      it("allows people to fund and withdraw", async function () {
        const fundContract = await fundMe.fund({ value: sendEth })
        fundContract.wait(1)

        currentFundMeBalance = await fundMe.provider.getBalance(fundMe.address)

        console.log(
          "Current FundMe balance should be 0.01. It is:",
          currentFundMeBalance
        )
        assert.equal(currentFundMeBalance.toString(), "0.01")

        const withdrawContract = await fundMe.withdraw()
        withdrawContract.wait(1)

        const endingFundMeBalance = await fundMe.provider.getBalance(
          fundMe.address
        )
        console.log("Ending FundMe Balance should be 0. It is: ", endingFundMeBalance)
        assert.equal(endingFundMeBalance.toString(), "0")
      })
    })
