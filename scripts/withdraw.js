import { network } from "hardhat";
import { formatEther } from "viem";
import dotenv from "dotenv";

dotenv.config();

/**
 * Withdraw funds from GameStore contract
 * Usage: npx hardhat run scripts/withdraw.js --network sepolia
 */
async function main() {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  
  // Your deployed contract address
  const contractAddress = process.env.NEXT_PUBLIC_GAMESTORE_ADDRESS_SEPOLIA;
  
  if (!contractAddress) {
    console.error("❌ Contract address not found in .env");
    process.exit(1);
  }

  console.log("\n💰 Withdrawing funds from GameStore...");
  console.log(`📍 Contract: ${contractAddress}`);
  
  // Get contract instance (assuming you've deployed GameStoreV2)
  const gameStore = await viem.getContractAt("GameStoreV2", contractAddress);
  
  // Check contract balance
  const balance = await publicClient.getBalance({ address: contractAddress });
  console.log(`💵 Contract Balance: ${formatEther(balance)} ETH`);
  
  if (balance === 0n) {
    console.log("⚠️  No funds to withdraw");
    return;
  }
  
  // Get owner address
  const [deployer] = await viem.getWalletClients();
  console.log(`👤 Your Address: ${deployer.account.address}`);
  
  // Check your balance before
  const balanceBefore = await publicClient.getBalance({ address: deployer.account.address });
  console.log(`💳 Your Balance Before: ${formatEther(balanceBefore)} ETH`);
  
  // Withdraw all funds
  console.log("\n🔄 Withdrawing...");
  const hash = await gameStore.write.withdraw();
  
  console.log(`📝 Transaction Hash: ${hash}`);
  console.log("⏳ Waiting for confirmation...");
  
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  
  if (receipt.status === "success") {
    console.log("✅ Withdrawal successful!");
    
    // Check balances after
    const balanceAfter = await publicClient.getBalance({ address: deployer.account.address });
    const contractBalanceAfter = await publicClient.getBalance({ address: contractAddress });
    
    console.log(`\n💵 Contract Balance After: ${formatEther(contractBalanceAfter)} ETH`);
    console.log(`💳 Your Balance After: ${formatEther(balanceAfter)} ETH`);
    console.log(`💰 Amount Withdrawn: ${formatEther(balance)} ETH`);
    
    // Explorer link
    const explorerUrl = network.name === "sepolia" 
      ? `https://sepolia.etherscan.io/tx/${hash}`
      : `https://sepolia.basescan.org/tx/${hash}`;
    
    console.log(`\n🔍 View on Explorer: ${explorerUrl}`);
  } else {
    console.error("❌ Withdrawal failed");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
