import lighthouse from '@lighthouse-web3/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY;

if (!LIGHTHOUSE_API_KEY) {
  console.error('❌ LIGHTHOUSE_API_KEY not found in .env');
  process.exit(1);
}

// Contract addresses for token-gating
const CROSSCHAIN_SEPOLIA = process.env.NEXT_PUBLIC_CROSSCHAIN_GAMESTORE_ADDRESS_SEPOLIA;
const CROSSCHAIN_BASE = process.env.NEXT_PUBLIC_CROSSCHAIN_GAMESTORE_ADDRESS_BASE;

/**
 * Upload inventory metadata to Lighthouse
 */
async function uploadInventoryMetadata() {
  console.log('\n🚀 Uploading Inventory Metadata to Lighthouse...\n');
  
  const inventoryDir = path.join(__dirname, '..', 'assets', 'inventory');
  const files = fs.readdirSync(inventoryDir).filter(f => f.endsWith('.json'));
  
  const uploadResults = {};

  for (const file of files) {
    const filePath = path.join(inventoryDir, file);
    const itemId = file.replace('.json', '');
    
    console.log(`📤 Uploading ${itemId}...`);
    
    try {
      const uploadResponse = await lighthouse.upload(filePath, LIGHTHOUSE_API_KEY);
      const cid = uploadResponse.data.Hash;
      
      uploadResults[itemId] = {
        cid: cid,
        url: `https://gateway.lighthouse.storage/ipfs/${cid}`,
        name: JSON.parse(fs.readFileSync(filePath, 'utf-8')).name
      };
      
      console.log(`✅ ${itemId}: ${cid}`);
      console.log(`   📍 ${uploadResults[itemId].url}`);
    } catch (error) {
      console.error(`❌ Failed to upload ${itemId}:`, error.message);
    }
  }
  
  // Save mapping to file
  const mappingPath = path.join(__dirname, '..', 'assets', 'inventory-cids.json');
  fs.writeFileSync(mappingPath, JSON.stringify(uploadResults, null, 2));
  
  console.log(`\n✅ Mapping saved to: ${mappingPath}`);
  console.log(`\n📊 Total items uploaded: ${Object.keys(uploadResults).length}`);
  
  return uploadResults;
}

/**
 * Apply token-gating conditions to inventory items
 * Only users who own the item on-chain can access the metadata
 */
async function applyTokenGating(itemId, cid) {
  console.log(`\n🔐 Applying token-gating for ${itemId}...`);
  
  try {
    const conditions = [
      {
        id: 1,
        chain: "Sepolia",
        method: "ownsItem",
        standardContractType: "Custom",
        contractAddress: CROSSCHAIN_SEPOLIA,
        returnValueTest: {
          comparator: "==",
          value: "true"
        },
        parameters: [":userAddress", itemId],
        inputArrayType: ["address", "string"],
        outputType: "bool"
      },
      {
        id: 2,
        chain: "BaseSepolia", 
        method: "ownsItem",
        standardContractType: "Custom",
        contractAddress: CROSSCHAIN_BASE,
        returnValueTest: {
          comparator: "==",
          value: "true"
        },
        parameters: [":userAddress", itemId],
        inputArrayType: ["address", "string"],
        outputType: "bool"
      }
    ];

    const aggregator = "([1] or [2])"; // User must own item on Sepolia OR Base

    const response = await lighthouse.applyAccessCondition(
      cid,
      conditions,
      aggregator,
      LIGHTHOUSE_API_KEY
    );

    console.log(`✅ Token-gating applied: ${response.data.cid}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to apply token-gating:`, error.message);
    throw error;
  }
}

/**
 * Get decryption key for an item (user must own it)
 */
async function getDecryptionKey(cid, userAddress) {
  console.log(`\n🔑 Getting decryption key for ${userAddress}...`);
  
  try {
    const keyResponse = await lighthouse.fetchEncryptionKey(
      cid,
      userAddress,
      LIGHTHOUSE_API_KEY
    );
    
    console.log('✅ Decryption key retrieved');
    return keyResponse.data.key;
  } catch (error) {
    console.error('❌ Failed to get decryption key:', error.message);
    throw error;
  }
}

/**
 * Retrieve and decrypt inventory metadata
 */
async function getInventoryDetails(itemId, userAddress) {
  console.log(`\n📦 Fetching inventory details for ${itemId}...`);
  
  try {
    // Load CID mapping
    const mappingPath = path.join(__dirname, '..', 'assets', 'inventory-cids.json');
    const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
    
    if (!mapping[itemId]) {
      throw new Error(`Item ${itemId} not found in mapping`);
    }
    
    const { cid, url } = mapping[itemId];
    
    console.log(`📍 CID: ${cid}`);
    console.log(`🌐 URL: ${url}`);
    
    // For non-encrypted files, just fetch directly
    const response = await fetch(url);
    const metadata = await response.json();
    
    console.log(`✅ Retrieved metadata for: ${metadata.name}`);
    return metadata;
  } catch (error) {
    console.error('❌ Failed to get inventory details:', error.message);
    throw error;
  }
}

/**
 * Batch upload all inventory and apply token-gating
 */
async function setupInventory() {
  console.log('\n🎮 Setting Up Complete Inventory System...\n');
  
  // Step 1: Upload all metadata
  const uploadResults = await uploadInventoryMetadata();
  
  // Step 2: Apply token-gating to each item
  console.log('\n🔐 Applying token-gating to all items...\n');
  
  for (const [itemId, data] of Object.entries(uploadResults)) {
    try {
      await applyTokenGating(itemId, data.cid);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
    } catch (error) {
      console.error(`Failed to apply token-gating for ${itemId}`);
    }
  }
  
  console.log('\n✅ Inventory system setup complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Update frontend to fetch from Lighthouse');
  console.log('   2. Use inventory-cids.json for mapping');
  console.log('   3. Implement token-gated access in UI');
}

// CLI Commands
const command = process.argv[2];

switch (command) {
  case 'upload':
    uploadInventoryMetadata();
    break;
  case 'setup':
    setupInventory();
    break;
  case 'get':
    const itemId = process.argv[3];
    const userAddress = process.argv[4];
    if (!itemId) {
      console.error('Usage: npm run lighthouse:inventory get <itemId> [userAddress]');
      process.exit(1);
    }
    getInventoryDetails(itemId, userAddress);
    break;
  case 'protect':
    const protectItemId = process.argv[3];
    const protectCid = process.argv[4];
    if (!protectItemId || !protectCid) {
      console.error('Usage: npm run lighthouse:inventory protect <itemId> <cid>');
      process.exit(1);
    }
    applyTokenGating(protectItemId, protectCid);
    break;
  default:
    console.log(`
🔐 Lighthouse Inventory Manager

Commands:
  upload    - Upload all inventory metadata to Lighthouse
  setup     - Complete setup: upload + token-gating
  get       - Get inventory details for an item
  protect   - Apply token-gating to a specific item

Examples:
  npm run lighthouse:inventory upload
  npm run lighthouse:inventory setup
  npm run lighthouse:inventory get sword-001 0xYourAddress
  npm run lighthouse:inventory protect sword-001 QmHash...
    `);
}
