const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
  const { deployer } = await getNamedAccounts()
  const fundMe = await ethers.getContract("FundMe", deployer)
  console.log("Funding Contract....")
  const  fundTx = await fundMe.fund({ value: ethers.utils.parseEther("0.1") })
  await fundTx.wait(1)

  console.log("Withdrawing from the contract...")
  const withdrawing = await fundMe.withdraw()
  await withdrawing.wait(1)

  console.log("Withdrawed 🥳")
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log("Withdrawing to FundMe contract: ", err)
    process.exit(1)
  })
