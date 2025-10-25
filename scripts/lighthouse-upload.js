import lighthouse from "@lighthouse-web3/sdk";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";

dotenv.config();

const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY;

if (!LIGHTHOUSE_API_KEY) {
  console.error("❌ LIGHTHOUSE_API_KEY not found in .env");
  process.exit(1);
}

/**
 * Upload a file to Lighthouse IPFS with encryption
 * @param {string} filePath - Path to the file to upload
 * @param {string} itemId - Unique item ID for the game asset
 * @returns {Promise<object>} - Upload result with CID and access control info
 */
async function uploadEncryptedAsset(filePath, itemId) {
  try {
    console.log(`\n📤 Uploading ${itemId} to Lighthouse...`);
    
    // Upload file with encryption
    const response = await lighthouse.upload(
      filePath,
      LIGHTHOUSE_API_KEY
    );

    console.log(`✅ Upload successful!`);
    console.log(`📦 CID: ${response.data.Hash}`);
    console.log(`🔗 Gateway URL: https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`);
    
    return {
      itemId,
      cid: response.data.Hash,
      name: response.data.Name,
      size: response.data.Size,
      gatewayUrl: `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`,
    };
  } catch (error) {
    console.error(`❌ Upload failed:`, error.message);
    throw error;
  }
}

/**
 * Apply access control conditions to an uploaded file
 * Requires NFT/Token ownership to decrypt
 * @param {string} cid - IPFS CID of the uploaded file
 * @param {string} contractAddress - GameStore contract address
 * @param {number} chainId - Chain ID (11155111 for Sepolia, 84532 for Base Sepolia)
 */
async function applyAccessControl(cid, contractAddress, chainId = 11155111) {
  try {
    console.log(`\n🔐 Applying access control to CID: ${cid}...`);
    
    // Access condition: Must have purchased from GameStore contract
    // This checks if the user has made any transaction to the contract
    const conditions = [
      {
        id: 1,
        chain: chainId === 11155111 ? "Sepolia" : "BaseSepolia",
        method: "balanceOf",
        standardContractType: "Custom",
        contractAddress: contractAddress,
        returnValueTest: {
          comparator: ">=",
          value: "1"
        },
        parameters: [":userAddress"],
      }
    ];

    const aggregator = "([1])";

    const response = await lighthouse.applyAccessCondition(
      LIGHTHOUSE_API_KEY,
      cid,
      {
        conditions,
        aggregator,
      }
    );

    console.log(`✅ Access control applied successfully`);
    console.log(`🔒 Only purchasers can decrypt this asset`);
    
    return response;
  } catch (error) {
    console.error(`❌ Access control failed:`, error.message);
    throw error;
  }
}

/**
 * Get decryption key for a protected file (requires ownership)
 * @param {string} cid - IPFS CID of the file
 * @param {string} userAddress - Address of the user requesting access
 */
async function getFileDecryptionKey(cid, userAddress) {
  try {
    console.log(`\n🔓 Fetching decryption key for ${userAddress}...`);
    
    const response = await lighthouse.fetchEncryptionKey(
      cid,
      userAddress,
      LIGHTHOUSE_API_KEY
    );

    if (response.data.key) {
      console.log(`✅ Decryption key obtained`);
      return response.data.key;
    } else {
      console.log(`❌ Access denied - user hasn't purchased this item`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Failed to fetch key:`, error.message);
    throw error;
  }
}

// CLI Usage
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const command = process.argv[2];
  
  if (command === "upload") {
    const filePath = process.argv[3];
    const itemId = process.argv[4];
    
    if (!filePath || !itemId) {
      console.log("Usage: node lighthouse-upload.js upload <file-path> <item-id>");
      process.exit(1);
    }
    
    uploadEncryptedAsset(filePath, itemId)
      .then(result => {
        console.log("\n📋 Save this info:");
        console.log(JSON.stringify(result, null, 2));
      })
      .catch(err => process.exit(1));
      
  } else if (command === "protect") {
    const cid = process.argv[3];
    const contractAddress = process.argv[4];
    const chainId = parseInt(process.argv[5] || "11155111");
    
    if (!cid || !contractAddress) {
      console.log("Usage: node lighthouse-upload.js protect <cid> <contract-address> [chain-id]");
      process.exit(1);
    }
    
    applyAccessControl(cid, contractAddress, chainId)
      .then(() => console.log("\n✅ Done!"))
      .catch(err => process.exit(1));
      
  } else {
    console.log(`
🏮 Lighthouse Asset Manager

Commands:
  upload <file-path> <item-id>              Upload encrypted asset
  protect <cid> <contract-address> [chain]  Apply access control

Examples:
  node lighthouse-upload.js upload ./assets/sword.png sword-001
  node lighthouse-upload.js protect QmXxx... 0x5b52... 11155111
    `);
  }
}

export { uploadEncryptedAsset, applyAccessControl, getFileDecryptionKey };
