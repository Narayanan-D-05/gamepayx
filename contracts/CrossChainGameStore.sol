// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CrossChainGameStore
 * @notice Game store with Avail-enabled cross-chain purchase tracking
 * @dev Stores purchase proofs that can be verified across chains via Avail DA
 */
contract CrossChainGameStore {
    address public owner;
    
    // Store purchase hashes that will be posted to Avail DA
    mapping(address => bytes32[]) public userPurchaseHashes;
    mapping(bytes32 => Purchase) public purchases;
    
    struct Purchase {
        address buyer;
        string itemId;
        uint256 price;
        uint256 timestamp;
        uint256 chainId;
        bool verified;
    }
    
    event ItemPurchased(
        address indexed buyer, 
        string itemId, 
        uint256 price,
        uint256 chainId,
        bytes32 purchaseHash
    );
    
    event FundsWithdrawn(address indexed owner, uint256 amount);
    event PurchaseVerified(bytes32 indexed purchaseHash, uint256 sourceChainId);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @notice Purchase an item and create cross-chain proof
     * @param itemId Unique identifier for the item
     * @param price Price of the item in wei
     */
    function purchaseItem(string memory itemId, uint256 price) external payable {
        require(msg.value >= price, "Insufficient funds");
        
        // Create unique purchase hash
        bytes32 purchaseHash = keccak256(abi.encodePacked(
            msg.sender,
            itemId,
            price,
            block.timestamp,
            block.chainid
        ));
        
        // Store purchase
        purchases[purchaseHash] = Purchase({
            buyer: msg.sender,
            itemId: itemId,
            price: price,
            timestamp: block.timestamp,
            chainId: block.chainid,
            verified: true
        });
        
        // Track user's purchases
        userPurchaseHashes[msg.sender].push(purchaseHash);
        
        emit ItemPurchased(msg.sender, itemId, price, block.chainid, purchaseHash);
    }
    
    /**
     * @notice Verify a purchase from another chain using Avail DA proof
     * @dev In production, this would verify against Avail DA layer
     * @param purchaseHash Hash of the purchase to verify
     * @param buyer Original buyer address
     * @param itemId Item purchased
     * @param price Price paid
     * @param sourceChainId Chain where purchase originated
     */
    function verifyCrossChainPurchase(
        bytes32 purchaseHash,
        address buyer,
        string memory itemId,
        uint256 price,
        uint256 sourceChainId
    ) external {
        require(purchases[purchaseHash].buyer == address(0), "Purchase already verified");
        
        // In production: Verify proof against Avail DA
        // For now, store the cross-chain purchase
        purchases[purchaseHash] = Purchase({
            buyer: buyer,
            itemId: itemId,
            price: price,
            timestamp: block.timestamp,
            chainId: sourceChainId,
            verified: true
        });
        
        userPurchaseHashes[buyer].push(purchaseHash);
        
        emit PurchaseVerified(purchaseHash, sourceChainId);
    }
    
    /**
     * @notice Check if user owns an item (on this chain or verified from another)
     * @param user Address to check
     * @param itemId Item to check ownership of
     */
    function ownsItem(address user, string memory itemId) external view returns (bool) {
        bytes32[] memory userPurchases = userPurchaseHashes[user];
        
        for (uint i = 0; i < userPurchases.length; i++) {
            Purchase memory purchase = purchases[userPurchases[i]];
            if (
                keccak256(bytes(purchase.itemId)) == keccak256(bytes(itemId)) &&
                purchase.verified
            ) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * @notice Get all purchases for a user
     * @param user Address to query
     */
    function getUserPurchases(address user) external view returns (bytes32[] memory) {
        return userPurchaseHashes[user];
    }
    
    /**
     * @notice Get purchase details
     * @param purchaseHash Hash of the purchase
     */
    function getPurchase(bytes32 purchaseHash) external view returns (Purchase memory) {
        return purchases[purchaseHash];
    }
    
    // ===== WITHDRAWAL FUNCTIONS =====
    
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(owner, balance);
    }
    
    function withdrawAmount(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient contract balance");
        
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(owner, amount);
    }
    
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}
