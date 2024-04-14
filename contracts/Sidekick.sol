// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {Enclave, autoswitch, Result} from "@oasisprotocol/sapphire-contracts/contracts/OPL.sol";

contract Sidekick is Enclave {
    event MessageReceived(bytes message);

    constructor(address _hero) Enclave(_hero, autoswitch("bsc")) {
        registerEndpoint("heroMessage", _heroMessage);
    }

    function pageHero(bytes calldata _message) external payable {
        postMessage("sidekickMessage", abi.encode(_message));
    }

    function _heroMessage(bytes calldata _args) internal returns (Result) {
        (bytes memory message) = abi.decode((_args), (bytes));
        emit MessageReceived(message);
        return Result.Success;
    }
}
