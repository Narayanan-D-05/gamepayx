import "@nomicfoundation/hardhat-toolbox-viem";
import dotenv from "dotenv";
dotenv.config();

import { configVariable } from "hardhat/config";
import hardhatToolboxViem from "@nomicfoundation/hardhat-toolbox-viem";
const { PRIVATE_KEY } = process.env;

const config = {
  plugins: [hardhatToolboxViem],
  solidity: "0.8.20",
  paths: {
    tests: {
      nodejs: "./test",
    },
  },
  networks: {
    hardhat: {
      type: "edr-simulated",
      chainType: "l1",
    },
    sepolia: {
      type: "http",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: PRIVATE_KEY ? [configVariable("PRIVATE_KEY")] : "remote",
    },
    baseSepolia: {
      type: "http",
      url: configVariable("BASE_SEPOLIA_RPC_URL"),
      accounts: PRIVATE_KEY ? [configVariable("PRIVATE_KEY")] : "remote",
    },
    availTuring: {
      type: "http",
      url: "https://turing-rpc.avail.so",
      accounts: PRIVATE_KEY ? [configVariable("PRIVATE_KEY")] : "remote",
      chainId: 2400,
    },
  },
};

export default config;
