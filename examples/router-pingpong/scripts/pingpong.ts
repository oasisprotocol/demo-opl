// Usage: pnpm hardhat run --network <network> scripts/pingpong.ts

import hre from "hardhat";
import {ethers} from "ethers";

async function main() {
    const [owner] = await hre.ethers.getSigners();
    const ownerAddress = await owner.getAddress();

    // const gatewayAddress = "0x4b7ff2fae6b514a7943d360e01790dc1dfaf6736"; //arb-sepolia
    // const gatewayAddress = "0x778a1f43459a05accd8b57007119f103c249f929"; //polygon-amoy

    const pingPongAddress = "0x50F08578E4aD621BBDfEe8752832623928884658"; // arb-sepolia
    // const pingPongAddress = "0x50F08578E4aD621BBDfEe8752832623928884658"; // polygon-amoy
    // const pingPongAddress = "0xe0DBFd05A5A5797984cC7e8b417572D341952233"; // sapphire-testnet

    // const pingPong = await hre.ethers.getContractAt("PingPong", pingPongAddress);
    // get pingpong contract
    const contractArtifact = await hre.artifacts.readArtifact("PingPong");
    const abi = contractArtifact.abi;
    const pingPong = new ethers.Contract(pingPongAddress, abi, owner);
    const metadata = await pingPong.getRequestMetadata(
        400000,
        100000000000,
        300000,
        30000000000,
        10000000000,
        3,
        false,
        "0x"
    );

    const destChaindId = "80002"; // polygon-amoy
    const destContractAddress = "0x50F08578E4aD621BBDfEe8752832623928884658" //polygon-amoy
    // const destChaindId = "23295"; // sapphire-testnet
    // const destContractAddress = "0xe0DBFd05A5A5797984cC7e8b417572D341952233" // spphire-testnet

    // set event listener
    pingPong.once(pingPong.filters.NewPing , (requestId, event) => {
        console.log("NewPing request id: ", requestId);
    });
    // pingPong.on(pingPong.filters.ExecutionStatus, (requestIdentifier, execFlag, event) => {
    //     console.log(`Execution Status for ${requestIdentifier}: ${execFlag}`);
    //     event.removeListener();
    // });
    // pingPong.on(pingPong.filters.AckFromDestination, (requestId, ackMessage, event) => {
    //     console.log(`AckFromDestination request id: ${requestId}, message: ${ackMessage}`);
    //     event.removeListener();
    // });
    
    // send ping
    console.log("Sending ping...");
    const newPing = await pingPong.iPing(destChaindId, destContractAddress, "hello ping", metadata);
    const receipt = await newPing.wait();
    console.log("Transaction hash: ", receipt.hash);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });