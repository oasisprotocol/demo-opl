import "@nomicfoundation/hardhat-ethers";
import { HardhatUserConfig, task } from "hardhat/config";
import { assert } from "console";

import '@oasisprotocol/sapphire-hardhat';
import "@nomicfoundation/hardhat-toolbox";
import { EventLog } from "ethers";

task('deploy-sidekick')
  .addParam('hostNetwork')
  .setAction(async (args, hre) => {
    const ethers = hre.ethers;
    const Sidekick = await ethers.getContractFactory('Sidekick');
    const signer = await ethers.provider.getSigner();
    const signerAddr = await signer.getAddress();

    const hostConfig = hre.config.networks[args.hostNetwork];
    if (!('url' in hostConfig)) throw new Error(`${args.hostNetwork} not configured`);
    const provider = new ethers.JsonRpcProvider(hostConfig.url);
    let nonce = await provider.getTransactionCount(signerAddr);
    const heroAddr = ethers.getCreateAddress({ from: signerAddr, nonce });

    const sidekick = await Sidekick.deploy(heroAddr);
    await sidekick.waitForDeployment();
    const sidekickAddr = await sidekick.getAddress();
    console.log('expected hero', heroAddr);
    console.log('sidekick', sidekickAddr);
    return sidekickAddr;
  });

task('deploy-hero')
  .addParam('sidekickAddr')
  .setAction(async (args, hre) => {
    await hre.run('compile');
    const Hero = await hre.ethers.getContractFactory('Hero');
    const hero = await Hero.deploy(args.sidekickAddr);
    await hero.waitForDeployment();
    const heroAddress = await hero.getAddress();
    console.log('Hero', heroAddress);
    return heroAddress;
  });

task('message-sidekick')
  .addParam('heroAddr')
  .setAction(async (args, hre) => {
    const ethers = hre.ethers;
    const signer = await ethers.provider.getSigner();
    const Hero = await ethers.getContractFactory('Hero');
    const hero = Hero.attach(args.heroAddr).connect(signer).attach(args.heroAddr);
    const value = ethers.parseEther('0.001');

    const result = await hero.getFunction('pageSidekick').send(ethers.encodeBytes32String("hello from bsc"), { value });
    console.log(result);
  });

task('message-hero')
  .addParam('sidekickAddr')
  .setAction(async (args, hre) => {
    const ethers = hre.ethers;
    const signer = await ethers.provider.getSigner();
    const Sidekick = await ethers.getContractFactory('Sidekick');
    const sidekick = Sidekick.connect(signer).attach(args.sidekickAddr);
    const value = ethers.parseEther('0.05');

    const result = await sidekick.getFunction('pageHero').send(ethers.encodeBytes32String("hello from sapp"), { value });
    console.log(result);
  });

task('verify-hero')
  .addParam('heroAddr')
  .setAction(async (args, hre) => {
    const ethers = hre.ethers;
    const signer = await ethers.provider.getSigner();
    // const block = await ethers.provider.getBlockNumber();
    const Hero = await ethers.getContractFactory('Hero');
    const hero = Hero.connect(signer).attach(args.heroAddr);
    // const events = await hero.queryFilter('MessageReceived', block - 1000, 'latest');
    const block = 39266185
    const events = (await hero.queryFilter('MessageReceived', block - 1000, block + 5)) as EventLog[];
    assert(events.length == 1);
    console.log(hero.interface.parseLog(events[0])?.args[0])
    assert(hero.interface.parseLog(events[0])?.args[0] == 'hello from sapp');
  });

task('verify-sidekick')
  .addParam('sidekickAddr')
  .setAction(async (args, hre) => {
    const ethers = hre.ethers;
    const signer = await ethers.provider.getSigner();
    const block = await ethers.provider.getBlockNumber();
    const Sidekick = await ethers.getContractFactory('Sidekick');
    const sidekick = Sidekick.connect(signer).attach(args.sidekickAddr);
    const events = await sidekick.queryFilter('MessageReceived', block - 1000, 'latest');
    assert(events.length == 1);
    assert(events[0].data == 'hello from bsc');
  });

const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    'bsc-testnet': {
      url: 'https://bsc-testnet.blockpi.network/v1/rpc/public',
      chainId: 97,
      accounts,
    },
    'sapphire-testnet': {
      // This is Testnet! If you want Mainnet, add a new network config item.
      url: "https://testnet.sapphire.oasis.io",
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY]
        : [],
      chainId: 0x5aff,
    },
  },
};

export default config;
