# 💰 Funds Management Guide

Understanding where your money goes and how to withdraw it.

---

## 📍 **Where Do Purchase Funds Go?**

### **Answer: To Your Smart Contract Address**

When users purchase items, ETH is sent to the **smart contract itself**, not directly to your personal wallet.

**Your Contract Addresses:**
- **Sepolia:** `0x5b52b0af04ce693233169a29a185d0b4a7a88907`
- **Base Sepolia:** `0x5b52b0af04ce693233169a29a185d0b4a7a88907`

---

## 💸 **Money Flow Diagram**

```
Customer Wallet (0xCustomer...)
         │
         │ Pays 0.001 ETH
         ↓
GameStore Contract (0x5b52b0af...)
         │
         │ Holds ETH
         │
         ↓
[CURRENT v1: ETH is LOCKED - no withdrawal function]
         
         OR
         
[UPGRADED v2: Owner can withdraw]
         │
         │ Owner calls withdraw()
         ↓
Your Personal Wallet (0xYour...)
         │
         └─→ You receive ETH! 💰
```

---

## ⚠️ **IMPORTANT: Current Contract Issue**

### **Your Current Contract (GameStore.sol):**

```solidity
// ⚠️ NO WITHDRAWAL FUNCTION!
function purchaseItem(string memory itemId, uint256 price) external payable {
    require(msg.value >= price, "Insufficient funds");
    emit ItemPurchased(msg.sender, itemId, price);
    // ETH comes in but there's NO way to get it out!
}
```

**Problem:** 
- ✅ ETH enters the contract
- ❌ ETH is **permanently locked** (no withdrawal function)
- ❌ You **cannot** access the funds

---

## ✅ **Solution: Upgrade to GameStoreV2**

I've created an improved version with withdrawal capabilities!

### **New Contract: GameStoreV2.sol**

```solidity
contract GameStoreV2 {
    address public owner; // Your wallet address
    
    constructor() {
        owner = msg.sender; // You become the owner
    }
    
    // Same purchase function
    function purchaseItem(string memory itemId, uint256 price) external payable {
        require(msg.value >= price, "Insufficient funds");
        emit ItemPurchased(msg.sender, itemId, price);
    }
    
    // ✅ NEW: Withdraw all funds
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    // ✅ NEW: Withdraw specific amount
    function withdrawAmount(uint256 amount) external onlyOwner {
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Withdrawal failed");
    }
    
    // ✅ NEW: Check balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
```

**Benefits:**
- ✅ Only YOU (the owner) can withdraw
- ✅ Withdraw all or specific amounts
- ✅ Check contract balance anytime
- ✅ Transfer ownership if needed

---

## 🚀 **How to Upgrade & Withdraw Funds**

### **Step 1: Deploy New Contract**

```bash
# Deploy GameStoreV2
npm run deploy:sepolia

# Or for Base Sepolia
npm run deploy:baseSepolia
```

**Update your `.env` with new contract address:**
```bash
NEXT_PUBLIC_GAMESTORE_ADDRESS_SEPOLIA=0xNewAddress...
NEXT_PUBLIC_GAMESTORE_ADDRESS_BASE=0xNewAddress...
```

### **Step 2: Update Frontend**

The frontend will automatically use the new contract address from `.env`.

### **Step 3: Check Contract Balance**

```bash
# On Sepolia
npx hardhat console --network sepolia

# In console:
const contract = await viem.getContractAt(
  "GameStoreV2", 
  "0xYourNewAddress..."
);
const balance = await contract.read.getBalance();
console.log(`Balance: ${viem.formatEther(balance)} ETH`);
```

### **Step 4: Withdraw Funds**

```bash
# Withdraw from Sepolia
npm run withdraw:sepolia

# Or from Base Sepolia
npm run withdraw:baseSepolia
```

**What happens:**
1. Script checks contract balance
2. Shows your current balance
3. Withdraws all funds to YOUR wallet
4. Shows confirmation and explorer link

---

## 📊 **Check Contract Balance Online**

### **Sepolia:**
https://sepolia.etherscan.io/address/0x5b52b0af04ce693233169a29a185d0b4a7a88907

### **Base Sepolia:**
https://sepolia.basescan.org/address/0x5b52b0af04ce693233169a29a185d0b4a7a88907

**What you'll see:**
- Total ETH held by contract
- All transactions (purchases)
- Event logs (ItemPurchased events)

---

## 💡 **Understanding the Difference**

### **Contract Address (Smart Contract)**
- **Purpose:** Holds the store logic
- **Function:** Receives purchases, stores ETH
- **Access:** Anyone can interact (buy items)
- **Example:** `0x5b52b0af04ce693233169a29a185d0b4a7a88907`

### **Owner Address (Your Personal Wallet)**
- **Purpose:** Your MetaMask wallet
- **Function:** Receives withdrawn funds
- **Access:** Only YOU control via private key
- **Example:** `0xYourWalletAddress...`

### **Flow:**
```
Customer → Contract (holds) → Owner withdraws → Your Wallet (keeps)
```

---

## 🔐 **Security Best Practices**

### **1. Only Owner Can Withdraw**
```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call this");
    _;
}
```

### **2. Check Before Withdrawal**
Always verify contract balance before withdrawing:
```bash
npm run withdraw:sepolia
# Script shows: "Contract Balance: 0.005 ETH"
```

### **3. Gas Costs**
Withdrawal costs gas (~$0.50-$2.00):
- Deducted from YOUR wallet
- Not from the contract balance

### **4. Transfer Ownership Carefully**
```solidity
function transferOwnership(address newOwner) external onlyOwner {
    owner = newOwner;
}
```
⚠️ Only do this if you're selling the store!

---

## 📋 **Withdrawal Scenarios**

### **Scenario 1: Regular Withdrawal**
```bash
# Customer bought 5 items @ 0.001 ETH each
# Contract has: 0.005 ETH

npm run withdraw:sepolia
# ✅ You receive: 0.005 ETH (minus gas)
```

### **Scenario 2: Partial Withdrawal**
```bash
# Contract has: 0.1 ETH
# You want: 0.05 ETH

npx hardhat console --network sepolia
await contract.write.withdrawAmount(parseEther("0.05"));
# ✅ Contract keeps: 0.05 ETH
# ✅ You receive: 0.05 ETH
```

### **Scenario 3: Emergency Full Withdrawal**
```bash
npm run withdraw:sepolia
# ✅ Empties contract, sends everything to you
```

---

## 🧮 **Example Calculation**

### **Revenue Tracking:**

| Transaction | Customer Pays | Gas Fee | To Contract |
|-------------|---------------|---------|-------------|
| Purchase #1 | 0.001 ETH | 0.0005 ETH | 0.001 ETH |
| Purchase #2 | 0.0015 ETH | 0.0005 ETH | 0.0015 ETH |
| Purchase #3 | 0.002 ETH | 0.0006 ETH | 0.002 ETH |
| **Total** | **0.0045 ETH** | **0.0016 ETH** | **0.0045 ETH** |

**Your Withdrawal:**
- Contract Balance: `0.0045 ETH`
- Withdrawal Gas: `-0.0008 ETH` (from your wallet)
- **You Receive: 0.0045 ETH**

---

## ⚡ **Quick Commands**

```bash
# Check balance (manual)
npx hardhat console --network sepolia
await viem.getBalance({ address: "0xYourContract..." })

# Withdraw all funds
npm run withdraw:sepolia
npm run withdraw:baseSepolia

# Deploy new contract with withdrawal
npm run deploy:sepolia
```

---

## 🎯 **Recommended Workflow**

### **For New Deployments:**
1. ✅ Deploy **GameStoreV2** (has withdrawal)
2. ✅ Update `.env` with new address
3. ✅ Test purchase flow
4. ✅ Verify you can withdraw

### **For Existing Contract:**
1. ⚠️ Current contract has NO withdrawal
2. ⚠️ Funds are LOCKED forever
3. ✅ Deploy GameStoreV2 to new address
4. ✅ Update frontend to use new contract
5. ✅ Old contract funds are unfortunately lost

---

## ❓ **FAQs**

### **Q: Can I withdraw from the current contract?**
**A:** No, GameStore.sol (v1) has no withdrawal function. Funds are locked.

### **Q: Do I need to upgrade?**
**A:** YES! Deploy GameStoreV2 to access your funds.

### **Q: Will customers lose their purchases?**
**A:** No, just update the contract address. Past purchases are on-chain events.

### **Q: Can someone else withdraw my funds?**
**A:** No, only the owner (you) can call `withdraw()`.

### **Q: How often should I withdraw?**
**A:** Depends on your preference:
- Daily (high volume)
- Weekly (moderate volume)
- Monthly (low volume)

### **Q: What if I lose my private key?**
**A:** Funds in the contract are lost. Backup your key!

---

## 🎉 **Summary**

**Where Funds Go:**
✅ Customer pays → Contract receives → You withdraw → Your wallet keeps

**Current Status:**
⚠️ GameStore.sol (v1): Funds LOCKED
✅ GameStoreV2.sol: Can withdraw anytime

**Next Steps:**
1. Deploy GameStoreV2
2. Update `.env`
3. Test withdrawal
4. Profit! 💰

---

**Questions?** Check the README or STATUS.md for more details!
