import { HardhatUserConfig } from "hardhat/config";
// import '@oasisprotocol/sapphire-hardhat';
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-switch-network";
import "./tasks"
import * as dotenv from 'dotenv';
dotenv.config();

const TEST_HDWALLET = {
	mnemonic: "test test test test test test test test test test test junk",
	path: "m/44'/60'/0'/0",
	initialIndex: 0,
	count: 20,
	passphrase: "",
};
const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : TEST_HDWALLET;


const config: HardhatUserConfig = {
  solidity: "0.8.24",
	networks: {
    'arbitrum-sepolia': {
      // url: 'https://endpoints.omniatech.io/v1/arbitrum/sepolia/public',
      // url: `https://arbitrum-sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      url: `https://arb-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      chainId: 421614,
      accounts
    },
    'polygon-amoy': {
      url: 'https://polygon-amoy-bor-rpc.publicnode.com',
      chainId: 80002,
      accounts
    },
		'sapphire': {
      url: 'https://sapphire.oasis.io',
      chainId: 0x5afe, // 23294
      accounts,
		},
		'sapphire-testnet': {
      url: 'https://testnet.sapphire.oasis.dev',
      chainId: 0x5aff, // 23295
      accounts,
		},
		'sapphire-localnet': {
      url: 'http://127.0.0.1:8545',
      chainId: 0x5afd, // 23293
      accounts,
		},
	},
};

export default config;
