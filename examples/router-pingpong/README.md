# PingPong via Router Protocol

This example lets you send a message via Router Protocol [CrossTalk]

[CrossTalk]: https://docs.routerprotocol.com/develop/message-transfer-via-crosstalk/

## Setup 

Install the necessary NPM dependencies using `pnpm` or module manager of choice.

```sh
pnpm install
```

Then, prepare your hex-encoded private key for paying the deployment gas fee
and store it as an environment variable:

```sh
export PRIVATE_KEY=0x...
```

You will need to obtain TEST tokens on both networks.


## Running the Example

To see the full example in action, run

```sh
pnpm hardhat full-pingpong
```

This will do the following:

- Deploy contracts on both testnets (Polygon Amoy Testent, Sapphire Testnet)
- (Waiting that you will approve the Feepayer at [Router Explorer][explorer])
- Send a message (`"Hello from Router"`) from the Polygon Amoy to the Sapphire Testnet
- Listen to the messege sent via CrossTalk on the Sapphire Testnet

If you want to run the steps one at a time, read the following chapters.

[explorer]: https://testnet.routerscan.io/feePayer

### Deploying Contracts

Deploy the contracts on the host network (BSC Testnet) and the enclave network
(Sapphire Testnet):

```sh
pnpm hardhat deploy-pingpong
```

### Sending the Ping Message

Sending the ping message from the host network (BSC Testnet):

```sh
pnpm hardhat send-ping --ping-addr <Ping contract address from above>
```

### Verifying the Message

Verifying that the ping message arrived on the enclave network (Sapphire-Testnet):

```sh
pnpm hardhat verify-ping --pong-addr <Pong contract address from above>
```


## PingPong Test without Tasks

### Deploy Contracts to both networks
First adjust the gateway address in `scripts/deploy.ts` to the one found in https://docs.routerprotocol.com/networks/supported-chains#for-testnet

After deploy the PingPong contract on the different networks

```shell
npx hardhat run scripts/deploy.ts --network <network>
```
e.g. to arbitrum-sepolia and sapphire-testnet

### Register Feepayer for contract in RouterProtocol
Connect with your account which you specified as feepayer while deploying on this website
(In the deploy.ts it is the deployer address by default)
https://testnet.routerscan.io/feePayer

To be deployed contracts should appear here and need to be approved.

hint: if the contracts aren't showing up here, you deployed the contract with the wrong gateway address

### Run PingPong test

```shell
npx hardhat run scripts/pingpong.ts --network <network>
```

