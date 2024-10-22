// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import {Host, Result} from "@oasisprotocol/sapphire-contracts/contracts/OPL.sol";

contract Hero is Host {
    event MessageReceived(bytes message);

    constructor(address _sidekick) Host(_sidekick) {
        registerEndpoint("sidekickMessage", _sidekickMessage);
    }

    function pageSidekick(bytes calldata _message) external payable {
        postMessage("heroMessage", abi.encode(_message));
    }

    function testSidekick(bytes calldata _message) external payable {
        emit MessageReceived(_message);
    }

    function _sidekickMessage(bytes calldata _args) internal returns (Result) {
        (bytes memory message) = abi.decode((_args), (bytes));
        emit MessageReceived(message);
        return Result.Success;
    }
}
