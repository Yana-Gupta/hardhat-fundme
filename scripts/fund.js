const { ethers, getNamedAccounts } = require("hardhat")

async function main() {
  const { deployer } = await getNamedAccounts()
  const fundMe = await ethers.getContract("FundMe", deployer)
  console.log(`Got contract FundMe at ${fundMe.address}`)
  console.log("Funding contract...")
  const transactionResponse = await fundMe.fund({
    value: ethers.utils.parseEther("0.1"),
  })
  await transactionResponse.wait()
  console.log(`Funded! 💫`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Funding to the FundMe contact: ",error)
    process.exit(1)
  })
