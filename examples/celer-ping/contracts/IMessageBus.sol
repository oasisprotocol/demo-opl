// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

interface IMessageBus {
    function sendMessage(
        address _receiver,
        uint256 _dstChainId,
        bytes calldata _message
    ) external payable;

    function calcFee(bytes calldata _message) external view returns (uint256);
}
