# 🚀 PayX Quick Start Guide

Get your game store running in 5 minutes!

## ✅ Prerequisites Check

Before starting, ensure you have:
- [x] Node.js v22+ installed
- [x] MetaMask extension installed
- [x] Sepolia testnet ETH (get from [faucet](https://sepoliafaucet.com/))
- [x] Lighthouse API key (get from [lighthouse.storage](https://www.lighthouse.storage/))

## 📦 Step 1: Install Dependencies

```bash
# Already done! ✅
# Backend: node_modules installed
# Frontend: frontend/node_modules installed
```

## 🔧 Step 2: Configure Environment

Your `.env` is already configured with:
- ✅ Sepolia RPC URL
- ✅ Base Sepolia RPC URL  
- ✅ Private key
- ✅ Contract addresses (deployed)
- ✅ Lighthouse API key

**Contract Addresses:**
- Sepolia: `0xfa6423dbce033fe3aae9b310dad1f8bf117c7ba7` (GameStoreV2 with withdrawal)
- Base Sepolia: `0xfa6423dbce033fe3aae9b310dad1f8bf117c7ba7` (GameStoreV2 with withdrawal)

## 🎨 Step 3: Start the Frontend

```bash
cd frontend
npm run dev
```

Then open: **http://localhost:3000**

## 🎮 Step 4: Test Purchase Flow

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Approve MetaMask connection
   - Ensure you're on Sepolia network

2. **Purchase an Item**
   - Click "Purchase Item" on any card
   - Confirm transaction in MetaMask
   - Wait for confirmation (~15 seconds)

3. **View Transaction**
   - Click "View Transaction" link
   - See your purchase on Etherscan

## 🔒 Step 5: Upload Encrypted Assets (Optional)

```bash
# Create a sample image file in assets/ folder
# Then upload it:
node scripts/lighthouse-upload.js upload ./assets/sword-001.png sword-001

# Copy the CID from output, then apply access control:
node scripts/lighthouse-upload.js protect <YOUR_CID> 0xfa6423dbce033fe3aae9b310dad1f8bf117c7ba7 11155111
```

## 🧪 Step 6: Run Tests

```bash
# From root directory
npm test
```

Expected output:
```
✔ GameStore deployment and purchase flow (2385ms)
✔ GameStoreV2 - Purchase and Withdrawal Flow (3240ms)
2 passing (4150ms)
```

## 💰 Step 7: Withdraw Your Earnings

Once customers have purchased items, withdraw the ETH to your wallet:

```bash
# Check balance and withdraw from Sepolia
npm run withdraw:sepolia

# Or from Base Sepolia
npm run withdraw:baseSepolia
```

The script will:
- Show current contract balance
- Show your wallet balance before
- Withdraw all funds to your wallet
- Show your wallet balance after
- Provide transaction link

## 🌐 Network Switching

### Switch to Base Sepolia

1. In MetaMask, add Base Sepolia:
   - Network Name: Base Sepolia
   - RPC URL: https://sepolia.base.org
   - Chain ID: 84532
   - Currency Symbol: ETH
   - Block Explorer: https://sepolia.basescan.org

2. Get Base Sepolia ETH from [faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

3. Refresh the app and purchase items on Base!

## 📱 Frontend Features

### Available Now:
- ✅ Wallet connection (MetaMask)
- ✅ Network detection (Sepolia/Base)
- ✅ 3 sample items (Sword, Shield, Armor)
- ✅ Purchase with transaction confirmation
- ✅ Real-time status updates
- ✅ Block explorer links

### Coming Soon (Customize as needed):
- [ ] Avail Nexus cross-chain bridge integration
- [ ] Display encrypted assets after purchase
- [ ] User inventory/purchases list
- [ ] Item marketplace with secondary sales
- [ ] Multi-chain balance aggregation

## 🎯 Common Tasks

### Deploy to a New Network

```bash
# Add network to hardhat.config.js:
myNetwork: {
  type: "http",
  url: configVariable("MY_NETWORK_RPC_URL"),
  accounts: PRIVATE_KEY ? [configVariable("PRIVATE_KEY")] : "remote",
}

# Add to package.json scripts:
"deploy:myNetwork": "hardhat run scripts/deploy.js --network myNetwork"

# Deploy:
npm run deploy:myNetwork
```

### Add New Items

Edit `frontend/app/page.tsx`:

```tsx
<PurchaseCard
  itemId="potion-001"
  itemName="Health Potion"
  itemDescription="Restores 50 HP"
  price="0.0005"
  imageUrl="/items/potion.png"
/>
```

### Check Contract on Explorer

- **Sepolia**: https://sepolia.etherscan.io/address/0xfa6423dbce033fe3aae9b310dad1f8bf117c7ba7
- **Base Sepolia**: https://sepolia.basescan.org/address/0xfa6423dbce033fe3aae9b310dad1f8bf117c7ba7

## 🐛 Troubleshooting

### Frontend won't start
```bash
cd frontend
rm -rf node_modules .next
npm install
npm run dev
```

### Transaction failing
- Ensure you have enough Sepolia ETH
- Check you're on the correct network
- Try increasing gas limit in MetaMask

### Lighthouse upload failing
- Verify `LIGHTHOUSE_API_KEY` in `.env`
- Check file size (< 100MB recommended)
- Ensure file path is correct

### Tests failing
```bash
npm run compile
npm test
```

## 📚 Learn More

- [Hardhat 3 Docs](https://hardhat.org/hardhat-runner/docs/getting-started)
- [Avail Nexus Guide](https://docs.availproject.org/)
- [Lighthouse Storage](https://docs.lighthouse.storage/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)

## 🎉 You're Ready!

Your complete Web3 game store is now live at **http://localhost:3000**

**What's working:**
- ✅ Smart contracts deployed
- ✅ Frontend running
- ✅ Wallet connection
- ✅ Purchase functionality
- ✅ Encrypted storage scripts
- ✅ Multi-chain support

Start building your game economy! 🚀
