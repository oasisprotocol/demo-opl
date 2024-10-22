import { task, subtask } from "hardhat/config";
import { Confirm } from 'enquirer';
import { assert } from "console";

task("full-pingpong")
  .addOptionalParam("message", "The message that should be bridged")
  .addOptionalParam("pingNetwork", "Network to deploy the sender contract on")
  .addOptionalParam("pongNetwork", "Network to deploy the receiver contract on")
  .addOptionalParam("pongChainId", "Network to send ping to", "23295")
  .addOptionalParam("pingGateway", "Gateway contract address from host network")
  .addOptionalParam("pongGateway", "Gateway contract address from enclave network")
  .setAction(async ({message, pingNetwork, pongNetwork, pongChainId, pingGateway, pongGateway}, hre) => {
    const { pingAddr, pongAddr } = await hre.run("deploy-pingpong", {
      pingNetwork,
      pingGateway,
      pongNetwork,
      pongGateway
    });

    // wait for fee payer approval
    const prompt = new Confirm({
        message: `Please approve feepayer at Router Explorer before continuing.`,
        initial: true
      })

    const answer = await prompt.run()
    if (!answer) {
    process.exit(1)
    }

    console.log("===========================");
    await hre.run("send-ping", {
      pingAddr,
      pongAddr,
      message,
      pingNetwork,
      destChainId: pongChainId
    });

    console.log("===========================");
    await hre.run("verify-ping", {
      pongAddr,
      message,
      pongNetwork
    });
  })

task('deploy-pingpong') 
//   .addOptionalParam("pingNetwork", "Network to deploy the Ping contract on", "polygon-amoy")
// .addOptionalParam("pingGateway", "Gateway contract address", "0x778a1f43459a05accd8b57007119f103c249f929")
  .addOptionalParam("pingNetwork", "Network to deploy the Ping contract on", "arbitrum-sepolia")
  .addOptionalParam("pingGateway", "Gateway contract address", "0x4b7ff2fae6b514a7943d360e01790dc1dfaf6736")
  .addOptionalParam("pongNetwork", "Network to deploy the Pong contract on", "sapphire-testnet")
  .addOptionalParam("pongGateway", "Gateway contract address", "0xfbe6d1e711cc2bc241dfa682cbbff6d68bf62e67")
  .setAction(async ({pingNetwork, pingGateway, pongNetwork, pongGateway}, hre) => {
    // Ensure contracts are compiled before proceeding
    await hre.run('compile');
    console.log("Start deployment of PingPong...");

    console.log("===========================");
    const pingAddr = await hre.run("deployPingPong", {
        pingPongNetwork: pingNetwork,
        gateway: pingGateway
    });
    console.log("===========================");
    const pongAddr = await hre.run("deployPingPong", {
        pingPongNetwork: pongNetwork,
        gateway: pongGateway
    });
    return { pingAddr, pongAddr };
});

subtask("deployPingPong")
  .addParam("pingPongNetwork", "Network to deploy the Ping contract on")
  .addParam("gateway", "Gateway contract address")
  .setAction(async ({pingPongNetwork, gateway}, hre) => {
    await hre.switchNetwork(pingPongNetwork);
    const [owner] = await hre.ethers.getSigners();
    console.log(`Deploying on ${hre.network.name}...`);
    const PingPong = await hre.ethers.getContractFactory("PingPong");    
    const pingpong = await PingPong.deploy(gateway, owner.address);
    const pingpongAddr = await pingpong.waitForDeployment();
    console.log(`PingPong deployed at: ${pingpongAddr.target}`);
    return pingpongAddr.target;
})

task("send-ping")
  .addParam("pingAddr", "Address of the Ping contract")
  .addParam("pongAddr", "Address of the Pong contract")
  .addOptionalParam("message", "The message that should be bridged", "Hello from Router")
  .addOptionalParam("pingNetwork", "Network to send the ping from", "polygon-amoy")
  .addOptionalParam("destChainId", "Network to send ping to", "23295")
  .setAction(async ({pingAddr, pongAddr, message, pingNetwork, destChainId}, hre) => {
    await hre.switchNetwork(pingNetwork);
    console.log(`Sending message on ${hre.network.name}...`);
    const [owner] = await hre.ethers.getSigners();
    const ping = await hre.ethers.getContractAt("PingPong", pingAddr, owner);

    // get metadata 
    const metadata = await ping.getRequestMetadata(
        400000,
        100000000000,
        300000,
        30000000000,
        10000000000,
        3,
        false,
        "0x"
    );
    
    console.log("Sending iPing message: ", message);
    const newPing = await ping.iPing(destChainId, pongAddr, message, metadata);
    const receipt = await newPing.wait();
    console.log("Message sent, Transaction hash: ", receipt.hash);
  })


task('verify-ping')
  .addParam('pongAddr', 'Address of the Pong contract')
  .addOptionalParam("message", "The message that should be bridged", "Hello from Router")
  .addOptionalParam("pongNetwork", "Network of receiving ping on", "sapphire-testnet")
  .setAction(async ({pongAddr, message, pongNetwork}, hre) => {
    await hre.switchNetwork(pongNetwork);
    console.log(`Verifying message on ${hre.network.name}...`);
    let events;
    const spinner = ['-', '\\', '|', '/'];
    let current = 0;

    // Spinner animation
    const interval = setInterval(() => {
        process.stdout.write(`\rListing for event... ${spinner[current]}`);
        current = (current + 1) % spinner.length;
    }, 150);

    const [owner] = await hre.ethers.getSigners();
    const pong = await hre.ethers.getContractAt("PingPong", pongAddr, owner);

    do {
      const block = await hre.ethers.provider.getBlockNumber();

      events = await pong.queryFilter('PingFromSource', block - 10, 'latest');
      if (events.length === 0) {
        await new Promise(resolve => setTimeout(resolve, 60 * 1000));
      }
    } while (events.length === 0);
    
    // Clear the spinner line
    clearInterval(interval);
    process.stdout.write(`\r`); 
    process.stdout.clearLine(0);

    const parsedEvent = pong.interface.parseLog(events[0]);
    // console.log(parsedEvent);
    const messageReceived = parsedEvent?.args?.message;
    console.log(`Message received with: ${messageReceived}`);
    assert(messageReceived == message);
  });
