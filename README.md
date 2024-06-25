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
pnpm hardhat deploy-hero --network bsc-testnet --sidekick--addr 0x...
```

Finally, we can verify that OPL is able to pass a message cross chains.

```sh
pnpm hardhat verify-hero --network bsc-testnet --hero-addr 0x
```
