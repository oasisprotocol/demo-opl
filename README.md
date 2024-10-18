# OPL Demo

This project demonstrates how to use [OPL] on Oasis Sapphire. Similar to this
Celer [example] which passes messages between two smart contracts deployed on
different chains. In this example, we will deploy one contract to Sapphire, and
another to BSC.

[OPL]: https://docs.oasis.io/dapp/opl/
[example]: https://im-docs.celer.network/developer/development-guide/contract-examples/hello-world

## Building, Testing, and Running

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

Now, we can deploy the first contract to the target network.

```sh
pnpm hardhat deploy-sidekick --network sapphire-testnet --host-network bsc-testnet
```

Let's use the address of the deployed contract as a param to deploy the second
contract.

```sh
pnpm hardhat deploy-hero --network bsc-testnet --sidekick--addr <deployed address from above>
```

We can send a message from a target network contract to our deployed contract
on the other network. The network used is that of the deployed contract.

Message Hero from Sidekick (sapphire-testnet > bsc-testnet)

```sh
pnpm hardhat message-hero --network sapphire-testnet --sidekick--addr <deployed address from above>
```

Message Sidekick from Hero (bsc-testnet > sapphire-testnet)

```sh
pnpm hardhat message-sidekick --network bsc-testnet --hero--addr <deployed address from above>
```

Finally, we can verify that OPL supports  passing a message cross chains.
This can take a few minutes on testnet.

***Note: you need to specify an archival node RPC endpoint***

```sh
pnpm hardhat verify-hero --network bsc-testnet --hero-addr <deployed address from above>
```
