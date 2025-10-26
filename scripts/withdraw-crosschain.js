import { network } from "hardhat";
import { formatEther } from "viem";
import dotenv from "dotenv";

dotenv.config();

/**
 * Withdraw funds from CrossChainGameStore contract
 * Usage: 
 *   npx hardhat run scripts/withdraw-crosschain.js --network sepolia
 *   npx hardhat run scripts/withdraw-crosschain.js --network baseSepolia
 */
async function main() {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const chainId = publicClient.chain.id;
  
  // Get contract address based on network
  const contractAddress = chainId === 11155111 
    ? process.env.NEXT_PUBLIC_CROSSCHAIN_ADDRESS_SEPOLIA
    : process.env.NEXT_PUBLIC_CROSSCHAIN_ADDRESS_BASE;
  
  if (!contractAddress) {
    console.error("❌ CrossChain contract address not found in .env");
    console.error(`   Looking for: NEXT_PUBLIC_CROSSCHAIN_ADDRESS_${chainId === 11155111 ? 'SEPOLIA' : 'BASE'}`);
    process.exit(1);
  }

  console.log("\n💰 Withdrawing funds from CrossChainGameStore...");
  console.log(`📍 Network: ${network.name} (Chain ID: ${chainId})`);
  console.log(`📍 Contract: ${contractAddress}`);
  
  // Get contract instance
  const crossChainStore = await viem.getContractAt("CrossChainGameStore", contractAddress);
  
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
  
  // Verify you're the owner
  const owner = await crossChainStore.read.owner();
  if (owner.toLowerCase() !== deployer.account.address.toLowerCase()) {
    console.error(`❌ You are not the owner of this contract`);
    console.error(`   Contract Owner: ${owner}`);
    console.error(`   Your Address: ${deployer.account.address}`);
    process.exit(1);
  }
  
  // Check your balance before
  const balanceBefore = await publicClient.getBalance({ address: deployer.account.address });
  console.log(`💳 Your Balance Before: ${formatEther(balanceBefore)} ETH`);
  
  // Withdraw all funds
  console.log("\n🔄 Withdrawing...");
  const hash = await crossChainStore.write.withdraw();
  
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
    const explorerUrl = chainId === 11155111 
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
