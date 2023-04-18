// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Escrow {
    address public moderator;
    address public receipient;
    address public sender;

    bool public isApproved;

    constructor(address _moderator, address _receipient) payable {
        moderator = _moderator;
        receipient = _receipient;
        sender = msg.sender;
    }

    event Approved(uint);

    function approve() external {
        require(msg.sender == moderator);
        uint balance = address(this).balance;
        (bool sent, ) = payable(receipient).call{value: balance}("");
        require(sent, "Failed to send Ether");
        emit Approved(balance);
        isApproved = true;
    }
}
