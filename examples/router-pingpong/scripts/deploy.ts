// Usage: pnpm hardhat run --network <network> scripts/deploy.ts

import hre from "hardhat";

async function main() {
    const [owner] = await hre.ethers.getSigners();
    const ownerAddress = await owner.getAddress();

    // const gatewayAddress = "0x4b7ff2fae6b514a7943d360e01790dc1dfaf6736"; //arb-sepolia
    const gatewayAddress = "0x778a1f43459a05accd8b57007119f103c249f929"; //polygon-amoy
    // const gatewayAddress = "0xfbe6d1e711cc2bc241dfa682cbbff6d68bf62e67"; // sapphire-testnet (oasis-testnet)

    // rpc providers for deploy in one script
    // const arbSeploiaRpcProvider = new ethers.JsonRpcProvider("https://endpoints.omniatech.io/v1/arbitrum/sepolia/public");
    // const polygonAmoyRpcProvider = new ethers.JsonRpcProvider("https://polygon-amoy-bor-rpc.publicnode.com");
    // const arbWallet = new ethers.Wallet(process.env.PRIVATE_KEY!, arbSeploiaRpcProvider);
    // const polygonWallet = new ethers.Wallet(process.env.PRIVATE_KEY!, polygonAmoyRpcProvider);


    const pingPong = await hre.ethers.deployContract("PingPong", [gatewayAddress, ownerAddress]);
    await pingPong.waitForDeployment();
    console.log(`PingPong contract deployed to ${pingPong.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });