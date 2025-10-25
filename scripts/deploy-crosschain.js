import { network } from "hardhat";

/**
 * Deploy CrossChainGameStore to any network
 * Usage: 
 *   npx hardhat run scripts/deploy-crosschain.js --network sepolia
 *   npx hardhat run scripts/deploy-crosschain.js --network availTuring
 */
async function main() {
  const { viem } = await network.connect();
  
  const publicClient = await viem.getPublicClient();
  const chainId = publicClient.chain.id;
  const networkName = network.name || `chain-${chainId}`;
  
  console.log("\n🚀 Deploying CrossChainGameStore...");
  console.log(`📍 Network: ${networkName}`);
  console.log(`⛓️  Chain ID: ${chainId}`);
  
  const store = await viem.deployContract("CrossChainGameStore");
  
  console.log("\n✅ CrossChainGameStore deployed!");
  console.log(`📍 Address: ${store.address}`);
  console.log(`🌐 Network: ${networkName}`);
  
  // Get owner (with error handling for slower networks)
  try {
    const owner = await store.read.owner();
    console.log(`👤 Owner: ${owner}`);
  } catch (error) {
    console.log(`👤 Owner: Deployment successful (owner will be available shortly)`);
  }
  
  console.log("\n📝 Add this to your .env:");
  console.log(`NEXT_PUBLIC_CROSSCHAIN_GAMESTORE_ADDRESS_${networkName.toUpperCase().replace(/-/g, '_')}=${store.address}`);
  
  if (chainId === 11155111) {
    console.log(`\n🔍 View on Etherscan:`);
    console.log(`https://sepolia.etherscan.io/address/${store.address}`);
  } else if (chainId === 84532) {
    console.log(`\n🔍 View on Basescan:`);
    console.log(`https://sepolia.basescan.org/address/${store.address}`);
  } else if (chainId === 2400) {
    console.log(`\n🔍 View on Avail Explorer:`);
    console.log(`https://turing.avail.tools/address/${store.address}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
