// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GameStoreV2 {
    address public owner;
    
    event ItemPurchased(address indexed buyer, string itemId, uint256 price);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    
    constructor() {
        owner = msg.sender; // You become the owner
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    function purchaseItem(string memory itemId, uint256 price) external payable {
        require(msg.value >= price, "Insufficient funds");
        emit ItemPurchased(msg.sender, itemId, price);
    }
    
    // 💰 NEW: Withdraw all funds to owner
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(owner, balance);
    }
    
    // 💰 NEW: Withdraw specific amount
    function withdrawAmount(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient contract balance");
        
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(owner, amount);
    }
    
    // 👀 Check contract balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // 🔄 Transfer ownership
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}
