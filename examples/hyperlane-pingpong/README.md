# Ping Pong via Hyperlane Protocol

This example lets you send a message via [Hyperlane Protocol]

[Hyperlane Protocol]: https://docs.hyperlane.xyz/docs/intro

## Prerequisites

To send messages to Sapphire Testnet the Hyperlane contracts need to be
deployed. To deploy it yourself, check the Oasis [docs]. Or use the deployed
contracts as in the example here.

If you want to use the already deployed contracts, add the yaml files from
`./config/` to your hyperlane config dir `~/.hyperlane/chains/sapphiretestnet/`

Additionally you need to run a relayer:

- [CLI Relayer](https://docs.hyperlane.xyz/docs/deploy-hyperlane#send-test-message)
- [Agent Relayer](https://docs.hyperlane.xyz/docs/guides/deploy-hyperlane-local-agents#overview)

[docs]: https://docs.oasis.io/build/opl/hyperlane/

## Setup 

Install the necessary NPM dependencies using `pnpm` or package manager of choice.

```sh
pnpm install
```

Then, prepare your hex-encoded private key for paying the deployment gas fee
and store it as an environment variable:

```sh
export PRIVATE_KEY=0x...
```

You will need to obtain TEST/ETH tokens on both networks (Arbitrum Sepolia, Sapphire Testnet).


## Running the Example

To see the full example in action, run

```sh
pnpm hardhat full-pingpong
```

This will do the following:

- Deploy Custom ISM on Arbitrum Sepolia
- Deploy contracts on both testnets (Arbitrum Sepolia, Sapphire Testnet)
- Enroll the matching contracts as Routers
- Send a message (`"Hello OPL"`) from Arbitrum Sepolia to the Sapphire Testnet
- Listen to the messege sent processed via the Mailbox on the Sapphire Testnet
- Send a message (`"Hello OPL"`) from the Sapphire Testnet to Arbitrum Sepolia
- Listen to the messege sent processed via the Mailbox on Arbitrum Sepolia

If you want to run the steps one at a time, read the following chapters.

### Deploy ISM Contract

Deploy the custom ISM contract on the host network (Arbitrum Sepolia):

```sh
pnpm hardhat deploy-ism
```

### Deploying Contracts

Deploy the contracts on the host network (Arbitrum Sepolia) and the enclave network
(Sapphire Testnet):

```sh
pnpm hardhat deploy-pingpong
```

### Enroll Routers

Enroll the contracts as routers on the matching contract on the other network:

```sh
pnpm hardhat enroll-routers --ping-addr <Ping contract address from Arbitrum Sepolia> --pong-addr <Pong contract address from Sapphire Testnet>
```

### Sending the Ping Message

Sending the ping message from the host network (Arbitrum Sepolia):

```sh
pnpm hardhat send-ping --ping-addr <Ping contract address from Arbitrum Sepolia>
```

### Verifying the Message

Verifying that the ping message arrived on the enclave network (Sapphire-Testnet):

```sh
pnpm hardhat verify-ping --contract-addr <Pong contract address from Sapphire Testnet>
```
