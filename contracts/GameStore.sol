// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GameStore {
    event ItemPurchased(address indexed buyer, string itemId, uint256 price);

    function purchaseItem(string memory itemId, uint256 price) external payable {
        require(msg.value >= price, "Insufficient funds");
        emit ItemPurchased(msg.sender, itemId, price);
    }
}
