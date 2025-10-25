# PayX - Cross-Chain Game Store 🎮⚔️

A decentralized game store built with **Hardhat 3**, **Avail Nexus** for cross-chain bridging, and **Lighthouse** for encrypted asset storage. Purchase in-game items on Sepolia and Base Sepolia testnets.

## 🌟 Features

- **Cross-Chain Payments**: Bridge tokens from Avail DA to Ethereum/Base using Avail Nexus
- **Smart Contract Store**: Purchase in-game items with ETH on Sepolia & Base Sepolia
- **Encrypted Assets**: Store game assets on IPFS with Lighthouse encryption
- **Token-Gated Content**: Only purchasers can decrypt and access assets
- **Modern Frontend**: Next.js 15 with Wagmi v2 and Viem
- **Full Test Coverage**: Hardhat 3 Node.js test runner with Viem assertions

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Smart Contracts](#-smart-contracts)
- [Frontend Setup](#-frontend-setup)
- [Lighthouse Integration](#-lighthouse-integration)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)

## 🛠 Tech Stack

### Backend
- **Hardhat 3.0.9** - Ethereum development environment
- **Solidity 0.8.20** - Smart contract language
- **Viem** - TypeScript interface for Ethereum
- **@nomicfoundation/hardhat-toolbox-viem** - Hardhat + Viem integration

### Frontend
- **Next.js 15** - React framework
- **Wagmi v2** - React hooks for Ethereum
- **TailwindCSS** - Utility-first CSS
- **@avail-project/nexus** - Avail Nexus SDK for bridging
- **@avail-project/nexus-widgets** - Pre-built bridge UI components

### Storage
- **Lighthouse Storage** - Encrypted IPFS storage
- **@lighthouse-web3/sdk** - Lighthouse JavaScript SDK

## ⚡ Prerequisites

- **Node.js v22+** (for Hardhat 3)
- **npm** or **yarn**
- **MetaMask** or compatible wallet
- **Testnet ETH** on Sepolia and/or Base Sepolia
- **Lighthouse API Key** (get from [lighthouse.storage](https://www.lighthouse.storage/))

## 📦 Installation

### 1. Clone & Install Dependencies

```bash
# Clone the repository
cd payx

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env
```

Edit `.env` with your credentials:

```bash
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
PRIVATE_KEY=your_wallet_private_key_without_0x_prefix

NEXT_PUBLIC_AVAIL_NETWORK=testnet
NEXT_PUBLIC_AVAIL_API_URL=https://bridge-api.sandbox.avail.so/

NEXT_PUBLIC_GAMESTORE_ADDRESS_SEPOLIA=0xfa6423dbce033fe3aae9b310dad1f8bf117c7ba7
NEXT_PUBLIC_GAMESTORE_ADDRESS_BASE=0xfa6423dbce033fe3aae9b310dad1f8bf117c7ba7

LIGHTHOUSE_API_KEY=your_lighthouse_api_key
```

### 3. Get Testnet Funds

- **Sepolia ETH**: [Alchemy Faucet](https://sepoliafaucet.com/)
- **Base Sepolia ETH**: [Base Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

## 📜 Smart Contracts

### GameStore Contract

Located at `contracts/GameStore.sol`:

```solidity
contract GameStore {
    event ItemPurchased(address indexed buyer, string itemId, uint256 price);

    function purchaseItem(string memory itemId, uint256 price) external payable {
        require(msg.value >= price, "Insufficient funds");
        emit ItemPurchased(msg.sender, itemId, price);
    }
}
```

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm test
```

### Deploy to Testnet

```bash
# Deploy to Sepolia
npm run deploy:sepolia

# Deploy to Base Sepolia
npm run deploy:baseSepolia
```

## 🎨 Frontend Setup

### Development Server

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
cd frontend
npm run build
npm start
```

### Frontend Features

- **Wallet Connection**: Connect MetaMask to Sepolia or Base Sepolia
- **Purchase Items**: Buy in-game items directly with ETH
- **Transaction Status**: Real-time transaction confirmation
- **Network Switching**: Auto-detect and switch between Sepolia/Base

## 🔒 Lighthouse Integration

### Upload Encrypted Assets

```bash
# Upload a game asset (image, 3D model, etc.)
node scripts/lighthouse-upload.js upload ./path/to/asset.png sword-001
```

**Output**:
```json
{
  "itemId": "sword-001",
  "cid": "QmXxXxXxXxXxXxXxXxXxXxXxX",
  "gatewayUrl": "https://gateway.lighthouse.storage/ipfs/QmXxX...",
  "size": "1234567"
}
```

### Apply Access Control

```bash
# Restrict access to purchasers only
node scripts/lighthouse-upload.js protect QmXxX... 0xfa6423dbce033fe3aae9b310dad1f8bf117c7ba7 11155111
```

**Parameters**:
- `<cid>`: IPFS CID from upload step
- `<contract-address>`: GameStore contract address
- `[chain-id]`: 11155111 (Sepolia) or 84532 (Base Sepolia)

### Access Protected Assets

Only users who have purchased items from the GameStore contract can decrypt and access the assets.

## 🚀 Deployment

### Deployed Contracts

| Network | Contract Address | Explorer |
|---------|------------------|----------|
| **Sepolia** | `0xfa6423dbce033fe3aae9b310dad1f8bf117c7ba7` | [View on Etherscan](https://sepolia.etherscan.io/address/0xfa6423dbce033fe3aae9b310dad1f8bf117c7ba7) |
| **Base Sepolia** | `0xfa6423dbce033fe3aae9b310dad1f8bf117c7ba7` | [View on Basescan](https://sepolia.basescan.org/address/0xfa6423dbce033fe3aae9b310dad1f8bf117c7ba7) |

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Only Solidity Tests

```bash
npx hardhat test solidity
```

### Run Only Node.js Tests

```bash
npx hardhat test nodejs
```

### Test Coverage

The project includes:
- ✅ Event emission tests (`ItemPurchased`)
- ✅ Payment validation tests (insufficient funds)
- ✅ Contract deployment verification

## 📁 Project Structure

```
payx/
├── contracts/
│   └── GameStore.sol           # Main game store contract
├── scripts/
│   ├── deploy.js               # Deployment script (Viem)
│   └── lighthouse-upload.js    # Lighthouse asset management
├── test/
│   └── GameStore.test.js       # Node.js tests (Viem)
├── frontend/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with Web3Provider
│   │   ├── page.tsx            # Main store page
│   │   └── globals.css         # TailwindCSS styles
│   ├── components/
│   │   ├── Web3Provider.tsx    # Wagmi configuration
│   │   └── PurchaseCard.tsx    # Item purchase component
│   ├── next.config.ts          # Next.js configuration
│   ├── tailwind.config.ts      # Tailwind configuration
│   └── package.json            # Frontend dependencies
├── hardhat.config.js           # Hardhat 3 configuration (ESM)
├── package.json                # Backend dependencies
├── .env.example                # Environment template
└── README.md                   # This file
```

## 🔧 Environment Variables

### Backend (.env)

```bash
# RPC URLs
SEPOLIA_RPC_URL=                # Alchemy/Infura Sepolia RPC
BASE_SEPOLIA_RPC_URL=           # Base Sepolia RPC

# Deployment
PRIVATE_KEY=                    # Wallet private key (no 0x)

# Avail Nexus
NEXT_PUBLIC_AVAIL_NETWORK=testnet
NEXT_PUBLIC_AVAIL_API_URL=https://bridge-api.sandbox.avail.so/

# Contract Addresses
NEXT_PUBLIC_GAMESTORE_ADDRESS_SEPOLIA=0x5b52...
NEXT_PUBLIC_GAMESTORE_ADDRESS_BASE=0x5b52...

# Lighthouse
LIGHTHOUSE_API_KEY=             # From lighthouse.storage
```

### Frontend (.env.local)

```bash
NEXT_PUBLIC_AVAIL_NETWORK=testnet
NEXT_PUBLIC_AVAIL_API_URL=https://bridge-api.sandbox.avail.so/
NEXT_PUBLIC_GAMESTORE_ADDRESS_SEPOLIA=0xfa6423dbce033fe3aae9b310dad1f8bf117c7ba7
NEXT_PUBLIC_GAMESTORE_ADDRESS_BASE=0xfa6423dbce033fe3aae9b310dad1f8bf117c7ba7
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=  # Optional
```

## 🎯 Usage Flow

1. **Connect Wallet** → MetaMask to Sepolia or Base Sepolia
2. **Browse Items** → View available in-game items
3. **Purchase** → Click "Purchase Item" and confirm transaction
4. **Access Assets** → Decrypt encrypted game assets with proof of purchase

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📄 License

ISC

## 🔗 Links

- [Hardhat Documentation](https://hardhat.org/)
- [Avail Nexus Docs](https://docs.availproject.org/)
- [Lighthouse Storage](https://www.lighthouse.storage/)
- [Viem Documentation](https://viem.sh/)
- [Wagmi Documentation](https://wagmi.sh/)

## 📞 Support

For issues or questions:
- Open a [GitHub Issue](https://github.com/yourusername/payx/issues)
- Join the [Avail Discord](https://discord.gg/avail)

---

**Built with ❤️ using Hardhat 3, Avail Nexus, and Lighthouse**
