const hre = require("hardhat");

async function main() {
  console.log("Starting deployment to BSC Mainnet...");
  
  // Contract addresses
  const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";
  const STAKING_ADDRESS = "0x30D22DA999f201666fB94F09aedCA24419822e5C";
  
  // Get the contract factory
  const PacaBingo = await hre.ethers.getContractFactory("PacaBingo");
  console.log("Contract factory created");

  // Deploy the contract with constructor arguments
  console.log("Deploying contract...");
  const pacaBingo = await PacaBingo.deploy(USDT_ADDRESS, STAKING_ADDRESS);
  console.log("Deployment transaction sent");

  // Wait for deployment to finish
  await pacaBingo.deployed();
  console.log("PacaBingo deployed to:", pacaBingo.address);
  
  // Wait for 5 block confirmations
  console.log("Waiting for block confirmations...");
  await pacaBingo.deployTransaction.wait(5);
  
  // Verify contract on BscScan
  console.log("Verifying contract on BscScan...");
  try {
    await hre.run("verify:verify", {
      address: pacaBingo.address,
      constructorArguments: [USDT_ADDRESS, STAKING_ADDRESS],
    });
    console.log("Contract verified on BscScan!");
  } catch (error) {
    console.error("Error verifying contract:", error);
  }
  
  console.log("Deployment completed successfully!");
  console.log("Contract address:", pacaBingo.address);
  console.log("View on BscScan:", `https://bscscan.com/address/${pacaBingo.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
