# 🔐 Lighthouse Inventory System

Complete guide to using Lighthouse for encrypted, token-gated inventory metadata.

---

## 🎯 **What is Lighthouse Inventory?**

Your game items' metadata (stats, lore, unlockables) are:
- **Stored on IPFS** via Lighthouse
- **Encrypted** for privacy
- **Token-gated** - only verified owners can access
- **Cross-chain** - works on Sepolia and Base

---

## 📁 **Project Structure**

```
assets/
└── inventory/
    ├── sword-001.json       # Legendary Sword metadata
    ├── shield-002.json      # Dragon Shield metadata
    └── armor-003.json       # Mythic Armor metadata

scripts/
└── lighthouse-inventory.js  # Upload & token-gating script

frontend/
├── lib/
│   └── lighthouse-inventory.ts    # Fetch utilities
├── components/
│   ├── InventoryDetailModal.tsx   # Rich item display
│   └── CrossChainInventory.tsx    # Clickable inventory
└── public/
    └── inventory-cids.json        # IPFS CID mapping
```

---

## 🚀 **Quick Start**

### **Step 1: Upload Inventory to Lighthouse**

```bash
npm run lighthouse:inventory:upload
```

**Output:**
```
🚀 Uploading Inventory Metadata to Lighthouse...

📤 Uploading sword-001...
✅ sword-001: QmXXX...
   📍 https://gateway.lighthouse.storage/ipfs/QmXXX...

📤 Uploading shield-002...
✅ shield-002: QmYYY...

📤 Uploading armor-003...
✅ armor-003: QmZZZ...

✅ Mapping saved to: assets/inventory-cids.json
📊 Total items uploaded: 3
```

### **Step 2: Apply Token-Gating**

```bash
npm run lighthouse:inventory:setup
```

This will:
1. Upload all metadata files
2. Apply access conditions (owner verification)
3. Create CID mapping file

---

## 🔐 **Token-Gating Configuration**

Items are protected with these conditions:

```javascript
{
  // Condition 1: Owns item on Sepolia
  chain: "Sepolia",
  method: "ownsItem",
  contractAddress: "0xb8954a4cea9c72e00b4b57267344fedd4b4d4d0a",
  parameters: [userAddress, "sword-001"]
}

OR

{
  // Condition 2: Owns item on Base
  chain: "BaseSepolia",
  method: "ownsItem",
  contractAddress: "0xcc350d9bc0286c278c9910d0c0311f74f88ca4d5",
  parameters: [userAddress, "sword-001"]
}
```

**Aggregator:** `([1] or [2])` - User must own on Sepolia **OR** Base

---

## 📝 **Inventory Metadata Format**

```json
{
  "itemId": "sword-001",
  "name": "Legendary Sword",
  "description": "A powerful sword...",
  "icon": "⚔️",
  "image": "https://gateway.lighthouse.storage/ipfs/QmImage",
  "attributes": [
    {
      "trait_type": "Damage",
      "value": 100
    },
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    }
  ],
  "stats": {
    "attack": 100,
    "defense": 20,
    "durability": 500,
    "weight": 8.5
  },
  "lore": "This blade was forged...",
  "unlockables": {
    "special_move": "Flame Slash",
    "combo_attacks": ["Rising Phoenix", "Dragon's Fury"],
    "skin_variants": ["Golden Blade", "Shadow Edge"]
  }
}
```

---

## 💻 **Frontend Integration**

### **Fetch Item Metadata**

```typescript
import { getInventoryMetadata } from '@/lib/lighthouse-inventory';

const metadata = await getInventoryMetadata('sword-001');

console.log(metadata.name);        // "Legendary Sword"
console.log(metadata.stats.attack); // 100
console.log(metadata.lore);        // Full backstory
```

### **Display Rich Item Details**

```tsx
import { InventoryDetailModal } from '@/components/InventoryDetailModal';

<InventoryDetailModal
  itemId="sword-001"
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  chainName="Sepolia"
/>
```

---

## 🎨 **UI Features**

### **Inventory Display**
- ✅ Grid of owned items
- ✅ Chain badges (Sepolia/Base)
- ✅ Clickable cards
- ✅ Purchase hash display

### **Detail Modal**
- ✅ Full stats with progress bars
- ✅ Rarity-based color schemes
- ✅ Lore and backstory
- ✅ Unlockable content
- ✅ Special moves and combos
- ✅ Skin variants
- ✅ Lighthouse security badge

### **Rarity System**

| Rarity | Color | Gradient |
|--------|-------|----------|
| Common | Gray | `from-gray-600` |
| Uncommon | Green | `from-green-600` |
| Rare | Blue | `from-blue-600` |
| Epic | Purple | `from-purple-600` |
| Legendary | Orange | `from-orange-600` |
| Mythic | Pink | `from-pink-600` |

---

## 🔧 **Available Commands**

```bash
# Upload all inventory metadata
npm run lighthouse:inventory:upload

# Complete setup (upload + token-gating)
npm run lighthouse:inventory:setup

# Get specific item details
npm run lighthouse:inventory get sword-001 0xYourAddress

# Apply token-gating to specific item
npm run lighthouse:inventory protect sword-001 QmCID...

# Show all commands
npm run lighthouse:inventory
```

---

## 📊 **Item Stats Explained**

### **Attack**
- Base damage dealt in combat
- Range: 0-150
- Swords have highest attack (100+)

### **Defense**
- Damage reduction percentage
- Range: 0-150
- Shields have highest defense (120+)

### **Durability**
- Total uses before breaking
- Range: 0-1000
- Armor has highest durability (1000)

### **Weight**
- Affects movement speed
- Range: 1-50 kg
- Lighter = faster movement

---

## 🎁 **Unlockable Content**

Each item includes exclusive unlockables:

### **Special Moves**
Unique abilities specific to the item:
- Sword: "Flame Slash"
- Shield: "Ice Barrier"
- Armor: "Lightning Strike"

### **Combo Attacks**
Multi-hit attack sequences:
- "Rising Phoenix"
- "Thunder Crash"
- "Frozen Fortress"

### **Skin Variants**
Cosmetic appearances:
- "Golden Blade"
- "Shadow Edge"
- "Divine Armor"

---

## 🔄 **Update Workflow**

### **Adding New Items**

1. **Create metadata file:**
```bash
# assets/inventory/potion-004.json
{
  "itemId": "potion-004",
  "name": "Health Potion",
  ...
}
```

2. **Upload to Lighthouse:**
```bash
npm run lighthouse:inventory:upload
```

3. **Apply token-gating:**
```bash
npm run lighthouse:inventory protect potion-004 QmNewCID
```

4. **Update frontend:**
```bash
# Copy assets/inventory-cids.json to frontend/public/
cp assets/inventory-cids.json frontend/public/
```

---

## 🐛 **Troubleshooting**

### **Issue: Upload Failed**

```
❌ Failed to upload sword-001: API Key invalid
```

**Fix:**
```bash
# Check .env has valid key
LIGHTHOUSE_API_KEY=your_key_here
```

### **Issue: Token-Gating Failed**

```
❌ Failed to apply token-gating: Contract not found
```

**Fix:**
- Ensure contracts are deployed
- Check contract addresses in .env
- Verify network is correct

### **Issue: Metadata Not Loading**

```
Failed to fetch: 404 Not Found
```

**Fix:**
```bash
# Re-upload inventory
npm run lighthouse:inventory:upload

# Copy new mapping to frontend
cp assets/inventory-cids.json frontend/public/
```

---

## 🔐 **Security Best Practices**

### **✅ DO:**
- Keep API keys in `.env` (gitignored)
- Use token-gating for valuable content
- Verify ownership on-chain before access
- Store only metadata on IPFS (not game logic)

### **❌ DON'T:**
- Commit `.env` files
- Hard-code API keys
- Store sensitive game logic in metadata
- Skip token-gating verification

---

## 📈 **Performance Tips**

### **Batch Loading**
```typescript
// Load multiple items at once
const items = await getBatchInventoryMetadata([
  'sword-001',
  'shield-002',
  'armor-003'
]);
```

### **Caching**
```typescript
// Cache metadata in React state
const [cache, setCache] = useState<Record<string, InventoryMetadata>>({});

if (cache[itemId]) {
  return cache[itemId];
}

const metadata = await getInventoryMetadata(itemId);
setCache(prev => ({ ...prev, [itemId]: metadata }));
```

---

## 🌐 **Cross-Chain Support**

Inventory works across:
- ✅ Ethereum Sepolia (Chain ID: 11155111)
- ✅ Base Sepolia (Chain ID: 84532)
- 🔄 Avail Turing (Coming Soon)

**Buy once, own everywhere!**

---

## 📚 **Resources**

- **Lighthouse Docs:** https://docs.lighthouse.storage
- **IPFS Gateway:** https://gateway.lighthouse.storage
- **Token-Gating Guide:** https://docs.lighthouse.storage/lighthouse-1/token-gating
- **API Reference:** https://docs.lighthouse.storage/lighthouse-1/api-reference

---

## 🎉 **Example Flow**

1. **Player purchases sword on Sepolia**
   ```
   → Transaction confirmed
   → Ownership recorded on-chain
   ```

2. **Player views inventory**
   ```
   → Frontend fetches purchases
   → Shows "Legendary Sword" card
   ```

3. **Player clicks sword card**
   ```
   → Modal opens
   → Fetches metadata from Lighthouse
   → Displays full stats, lore, unlockables
   ```

4. **Player switches to Base**
   ```
   → Same sword appears (cross-chain!)
   → Same metadata, same ownership
   ```

---

**Your inventory is now secured by Lighthouse!** 🔐✨

All item details are encrypted, token-gated, and accessible only to verified owners across all chains.
