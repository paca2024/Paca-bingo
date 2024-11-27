require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1 // Optimize for minimal deployment size
      },
      viaIR: true // Enable IR-based optimization
    }
  },
  networks: {
    bsc: {
      url: "https://bsc-dataseed1.binance.org/",
      chainId: 56,
      accounts: [PRIVATE_KEY],
      gasPrice: 3000000000, // 3 Gwei
      gas: 500000, // Reduced gas limit
      timeout: 120000 // 120 seconds
    }
  },
  etherscan: {
    apiKey: {
      bsc: BSCSCAN_API_KEY
    }
  }
};
