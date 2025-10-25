# 🌐 Avail Integration Guide

Complete guide to using Avail Nexus for cross-chain game store functionality.

---

## 🎯 **What Avail Adds to Your Project**

### **Cross-Chain Purchase Verification**
- Buy sword on Sepolia → Own it on Base Sepolia
- Purchase proofs stored on Avail DA layer
- Verify ownership across any connected chain

### **Unified Player Inventory**
- One inventory across all chains
- Items purchased on any chain are accessible everywhere
- Avail ensures data availability and verification

### **Multi-Chain Revenue Tracking**
- Aggregate sales from Ethereum, Base, Avail
- Single withdrawal from any chain
- Transparent cross-chain accounting

---

## 🚀 **Quick Start**

### **1. Deploy Cross-Chain Contracts**

```bash
# Deploy to Sepolia
npm run deploy:crosschain:sepolia

# Deploy to Base Sepolia
npm run deploy:crosschain:base

# Deploy to Avail Turing
npm run deploy:crosschain:avail
```

### **2. Update Environment Variables**

Add the new contract addresses to `.env`:

```bash
# Cross-Chain Contracts
NEXT_PUBLIC_CROSSCHAIN_GAMESTORE_ADDRESS_SEPOLIA=0xYourSepoliaAddress
NEXT_PUBLIC_CROSSCHAIN_GAMESTORE_ADDRESS_BASE=0xYourBaseAddress
NEXT_PUBLIC_CROSSCHAIN_GAMESTORE_ADDRESS_AVAIL=0xYourAvailAddress
```

---

## 🔧 **Network Configuration**

### **Avail Turing Testnet**
- **RPC URL:** https://turing-rpc.avail.so
- **Chain ID:** 2400
- **Explorer:** https://turing.avail.tools
- **Faucet:** https://faucet.avail.tools

### **Add to MetaMask**
1. Open MetaMask
2. Networks → Add Network
3. Enter:
   - Network Name: Avail Turing
   - RPC URL: https://turing-rpc.avail.so
   - Chain ID: 2400
   - Currency Symbol: AVAIL

---

## 💡 **How It Works**

### **Purchase Flow**

```
Step 1: User Buys Item on Sepolia
   ↓
Sepolia Contract creates purchase hash
   ↓
Purchase event emitted with hash
   ↓
Step 2: Off-chain Service Submits to Avail DA
   ↓
Avail stores purchase proof
   ↓
Step 3: Verify on Other Chains
   ↓
Base/Avail contract verifies using DA proof
   ↓
Item unlocked on all chains
```

### **Example: Buy Sword on Sepolia, Use on Base**

**On Sepolia:**
```javascript
// User purchases sword
await contract.purchaseItem("sword-001", parseEther("0.001"), {
  value: parseEther("0.001")
});

// Purchase hash created: 0xabc123...
```

**On Avail DA:**
```
Purchase proof stored:
{
  buyer: 0xUser...,
  itemId: "sword-001",
  chainId: 11155111,
  hash: 0xabc123...
}
```

**On Base Sepolia:**
```javascript
// Verify cross-chain purchase
await contract.verifyCrossChainPurchase(
  "0xabc123...",  // purchaseHash
  "0xUser...",    // buyer
  "sword-001",    // itemId
  parseEther("0.001"), // price
  11155111        // sourceChainId (Sepolia)
);

// Now user owns sword on Base too!
```

---

## 📊 **Contract Functions**

### **CrossChainGameStore.sol**

#### **Purchase Item**
```solidity
function purchaseItem(string memory itemId, uint256 price) external payable
```
Creates purchase and emits cross-chain proof.

#### **Verify Cross-Chain Purchase**
```solidity
function verifyCrossChainPurchase(
    bytes32 purchaseHash,
    address buyer,
    string memory itemId,
    uint256 price,
    uint256 sourceChainId
) external
```
Verifies a purchase from another chain.

#### **Check Ownership**
```solidity
function ownsItem(address user, string memory itemId) 
    external 
    view 
    returns (bool)
```
Returns true if user owns item (on any chain).

#### **Get User Purchases**
```solidity
function getUserPurchases(address user) 
    external 
    view 
    returns (bytes32[] memory)
```
Returns all purchase hashes for a user.

---

## 🧪 **Testing Cross-Chain Flow**

### **Test 1: Purchase on Sepolia**

```bash
# Deploy to Sepolia
npm run deploy:crosschain:sepolia

# Purchase item (use frontend or console)
const hash = await contract.purchaseItem("sword-001", parseEther("0.001"), {
  value: parseEther("0.001")
});

# Check purchase hash from event
console.log("Purchase Hash:", hash);
```

### **Test 2: Verify on Base**

```bash
# Deploy to Base
npm run deploy:crosschain:base

# Verify the purchase from Sepolia
await contract.verifyCrossChainPurchase(
  purchaseHash,
  buyerAddress,
  "sword-001",
  parseEther("0.001"),
  11155111  // Sepolia chain ID
);

# Check ownership
const owns = await contract.ownsItem(buyerAddress, "sword-001");
console.log("Owns sword on Base:", owns); // true
```

---

## 🎨 **Frontend Integration**

### **Show Cross-Chain Inventory**

```typescript
// components/CrossChainInventory.tsx
const inventory = await Promise.all([
  sepoliaContract.read.getUserPurchases([address]),
  baseContract.read.getUserPurchases([address]),
  availContract.read.getUserPurchases([address])
]);

// Merge and deduplicate by itemId
const allItems = mergePurchases(inventory);
```

### **Avail Nexus Widgets**

```typescript
import { AvailBridgeWidget } from '@avail-project/nexus-widgets';

<AvailBridgeWidget 
  sourceChain="sepolia"
  destinationChain="avail-turing"
/>
```

---

## 📝 **Deployment Checklist**

### **Step 1: Deploy Contracts**
- [ ] Deploy CrossChainGameStore to Sepolia
- [ ] Deploy CrossChainGameStore to Base Sepolia
- [ ] Deploy CrossChainGameStore to Avail Turing
- [ ] Save all contract addresses

### **Step 2: Configure Environment**
- [ ] Add contract addresses to `.env`
- [ ] Add Avail RPC to frontend config
- [ ] Update network switcher in UI

### **Step 3: Test Cross-Chain**
- [ ] Buy item on Sepolia
- [ ] Get purchase hash
- [ ] Verify on Base
- [ ] Check ownership on both chains

### **Step 4: Set Up Avail DA**
- [ ] Configure Avail DA submission
- [ ] Set up proof verification
- [ ] Test end-to-end flow

---

## 🔐 **Security Considerations**

### **Purchase Verification**
- ✅ Verify purchase hash integrity
- ✅ Check buyer address matches
- ✅ Prevent double-spend attacks
- ✅ Validate source chain ID

### **Avail DA Integration**
- ✅ Ensure data availability proofs
- ✅ Verify merkle proofs
- ✅ Check attestation validity
- ✅ Handle network failures gracefully

---

## 📚 **Resources**

### **Avail Documentation**
- **Main Docs:** https://docs.availproject.org
- **Nexus Guide:** https://docs.availproject.org/docs/build-with-avail/nexus
- **DA Layer:** https://docs.availproject.org/docs/build-with-avail/avail-da

### **Network Explorers**
- **Avail Turing:** https://turing.avail.tools
- **Sepolia:** https://sepolia.etherscan.io
- **Base Sepolia:** https://sepolia.basescan.org

### **Faucets**
- **Avail:** https://faucet.avail.tools
- **Sepolia:** https://sepoliafaucet.com
- **Base Sepolia:** https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

---

## 🎯 **Use Cases**

### **1. Cross-Chain Gaming**
- Buy items on cheap chain
- Use items on any chain
- Unified player profile

### **2. Multi-Chain Marketplace**
- List once, sell everywhere
- Aggregate liquidity
- Lower fees

### **3. Proof of Ownership**
- NFT-like ownership without NFTs
- Cross-chain verification
- Data availability guarantees

---

## 🚨 **Troubleshooting**

### **Issue: Purchase not verified on other chain**
```bash
# Check purchase hash is correct
await contract.getPurchase(purchaseHash);

# Verify chain IDs match
console.log("Source Chain:", sourceChainId);
console.log("Current Chain:", await publicClient.getChainId());
```

### **Issue: Ownership not showing**
```bash
# Check all user purchases
const purchases = await contract.getUserPurchases(userAddress);
console.log("Purchases:", purchases);

# Check specific item
const owns = await contract.ownsItem(userAddress, "sword-001");
console.log("Owns:", owns);
```

---

## 🎉 **Next Steps**

1. **Deploy cross-chain contracts** to all networks
2. **Test purchase flow** on Sepolia
3. **Verify on Base** and Avail
4. **Integrate frontend** with Avail widgets
5. **Set up DA submission** for production

---

**Your game store now supports true cross-chain functionality!** 🚀
