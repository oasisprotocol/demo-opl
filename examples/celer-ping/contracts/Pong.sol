// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {IMessageBus} from "./IMessageBus.sol";


contract Pong {
    address public messageBus;


    event MessageReceived(
        address srcContract,
        uint64 srcChainId,
        address sender,
        bytes message
    );

    enum ExecutionStatus {
        Fail, // execution failed, finalized
        Success, // execution succeeded, finalized
        Retry // execution rejected, can retry later
    }

    constructor(address _messageBus) {
        messageBus = _messageBus;
    }

    modifier onlyMessageBus() {
        require(msg.sender == messageBus, "caller is not message bus");
        _;
    }

    function sendPong(
        address _dstContract,
        uint64 _dstChainId,
        bytes calldata _message
    ) external payable {
        bytes memory message = abi.encode(msg.sender, _message);
        IMessageBus(messageBus).sendMessage{value: msg.value}(_dstContract, _dstChainId, message);
    }

    function executeMessage(
        address _srcContract,
        uint64 _srcChainId,
        bytes calldata _message,
        address // executor
    ) external payable onlyMessageBus returns (ExecutionStatus) {
        (address sender, bytes memory message) = abi.decode(
            (_message),
            (address, bytes)
        );
        emit MessageReceived(_srcContract, _srcChainId, sender, message);
        return ExecutionStatus.Success;
    }
}