const { deployments, getNamedAccounts, ethers, network } = require("hardhat")
const { assert, expect } = require("chai")

const { developmentChains } = require("../../helper-hardhat-config.js")

developmentChains.includes(network.name)
  ? describe("FundMe", async function () {
      let fundMe
      let deployer
      let mockV3Aggregator
      const sendEth = ethers.utils.parseUnits("0.1")
      beforeEach(async function () {
        // const accounts = await ethers.getSigners() // Gives the list of all accounts present in hardhat.config.js
        // const accountZero = accounts[0]

        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        )
      })

      describe("constructor", async function () {
        it("sets the aggregator adddresses correctly", async function () {
          const response = await fundMe.getPriceFeed()
          assert.equal(response, mockV3Aggregator.address)
        })
      })

      describe("fund", async function () {
        it("fails if you don't send enough eth", async function () {
          await expect(fundMe.fund()).to.be.revertedWith("DIDN'T SEND ENOUGH.")
        })

        it("update the amount funded data structure", async function () {
          await fundMe.fund({ value: sendEth })
          const response = await fundMe.getAddressToAmmount(deployer)
          await expect(response.toString(), sendEth.toString())
        })
      })

      describe("withdraw", async function () {
        beforeEach(async function () {
          await fundMe.fund({ value: sendEth })
        })

        it("withdraw ETH from a single founder", async function () {
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          const transactionResponse = await fundMe.withdraw()
          const transactionRecipt = await transactionResponse.wait(1)

          const { gasUsed, effectiveGasPrice } = transactionRecipt

          const gasCost = gasUsed.mul(effectiveGasPrice)

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )

          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          // GasCost

          // Assert
          assert.equal(endingFundMeBalance, 0)
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          )
        })

        it("allows us to withdraw with multiple getFunder", async function () {
          const accounts = await ethers.getSigners()
          for (let i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i])
            await fundMeConnectedContract.fund({ value: sendEth })
          }
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          const transactionResponse = await fundMe.withdraw()
          const transactionRecipt = await transactionResponse.wait(1)
          const { gasUsed, effectiveGasPrice } = transactionRecipt
          const gasCost = gasUsed.mul(effectiveGasPrice)
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          assert.equal(endingFundMeBalance, 0)
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          )
        })
        it("only allows the owner to withdraw", async function () {
          const accounts = await ethers.getSigners()
          // console.log(accounts)
          const attacker = accounts[1]
          // console.log(attacker)
          const attackerConnectedContract = await fundMe.connect(attacker)
          await expect(attackerConnectedContract.withdraw()).reverted
        })
      })

      describe("Cheaper Withdraw.....", async function () {
        beforeEach(async function () {
          await fundMe.fund({ value: sendEth })
        })

        it("withdraw ETH from a single founder", async function () {
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          const transactionResponse = await fundMe.cheaperWithdraw()
          const transactionRecipt = await transactionResponse.wait(1)

          const { gasUsed, effectiveGasPrice } = transactionRecipt

          const gasCost = gasUsed.mul(effectiveGasPrice)

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )

          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          // GasCost

          // Assert
          assert.equal(endingFundMeBalance, 0)
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          )
        })

        it("allows us to withdraw with multiple getFunder", async function () {
          const accounts = await ethers.getSigners()
          for (let i = 1; i < 6; i++) {
            const fundMeConnectedContract = await fundMe.connect(accounts[i])
            await fundMeConnectedContract.fund({ value: sendEth })
          }
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )
          const transactionResponse = await fundMe.cheaperWithdraw()
          const transactionRecipt = await transactionResponse.wait(1)
          const { gasUsed, effectiveGasPrice } = transactionRecipt
          const gasCost = gasUsed.mul(effectiveGasPrice)
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          )
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          )

          assert.equal(endingFundMeBalance, 0)
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          )

          // getFunder array should be reverted successfully
          await expect(fundMe.getFunder(0)).to.be.reverted

          // all the amount corresponding to their account must set to 0
          for (i = 1; i < 6; i++) {
            await expect(fundMe.getAddressToAmmount(accounts[i].address), 0)
          }
        })

        it("only allows the owner to withdraw", async function () {
          const accounts = await ethers.getSigners()
          // console.log(accounts)
          const attacker = accounts[1]
        // console.log(attacker)
          const attackerConnectedContract = await fundMe.connect(attacker)
          await expect(attackerConnectedContract.cheaperWithdraw()).reverted
        })
      })
    })
  : describe.skip
