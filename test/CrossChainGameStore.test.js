import test from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";
import { parseEther, getAddress, keccak256, encodePacked } from "viem";

test("CrossChainGameStore - Purchase and Cross-Chain Verification", async () => {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const store = await viem.deployContract("CrossChainGameStore");

  const [owner, buyer] = await viem.getWalletClients();
  const price = parseEther("0.001");

  console.log("\n🌐 Test: Cross-Chain Purchase Flow");
  console.log(`📍 Contract: ${store.address}`);
  console.log(`👤 Owner: ${owner.account.address}`);
  console.log(`🛒 Buyer: ${buyer.account.address}`);

  // Test 1: Verify owner
  const contractOwner = await store.read.owner();
  assert.equal(
    getAddress(contractOwner),
    getAddress(owner.account.address),
    "Owner should be deployer"
  );
  console.log("✅ Owner verified");

  // Test 2: Purchase item on "Sepolia" (simulated)
  const tx = await store.write.purchaseItem(["sword-001", price], {
    value: price,
    account: buyer.account
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
  console.log("✅ Purchase successful on origin chain");

  // Test 3: Get purchase event and hash
  const logs = await publicClient.getLogs({
    address: store.address,
    fromBlock: receipt.blockNumber,
    toBlock: receipt.blockNumber
  });

  assert.ok(logs.length > 0, "Should have purchase event");
  console.log("✅ Purchase event emitted");

  // Test 4: Check ownership on origin chain
  const ownsOnOrigin = await store.read.ownsItem([buyer.account.address, "sword-001"]);
  assert.equal(ownsOnOrigin, true, "Buyer should own item on origin chain");
  console.log("✅ Ownership verified on origin chain");

  // Test 5: Get user purchases
  const purchases = await store.read.getUserPurchases([buyer.account.address]);
  assert.equal(purchases.length, 1, "User should have 1 purchase");
  const purchaseHash = purchases[0];
  console.log(`✅ Purchase hash: ${purchaseHash}`);

  // Test 6: Get purchase details
  const purchase = await store.read.getPurchase([purchaseHash]);
  assert.equal(getAddress(purchase.buyer), getAddress(buyer.account.address));
  assert.equal(purchase.itemId, "sword-001");
  assert.equal(purchase.price, price);
  console.log("✅ Purchase details correct");

  // Test 7: Deploy "second chain" contract (simulates Base/Avail)
  const store2 = await viem.deployContract("CrossChainGameStore");
  console.log("\n🌉 Simulating cross-chain verification...");
  console.log(`📍 Second chain contract: ${store2.address}`);

  // Test 8: Verify ownership doesn't exist on second chain yet
  const ownsOnChain2Before = await store2.read.ownsItem([
    buyer.account.address,
    "sword-001"
  ]);
  assert.equal(ownsOnChain2Before, false, "Should not own item on chain 2 yet");
  console.log("✅ Item not yet available on second chain");

  // Test 9: Verify cross-chain purchase on second chain
  await store2.write.verifyCrossChainPurchase([
    purchaseHash,
    buyer.account.address,
    "sword-001",
    price,
    11155111n // Sepolia chain ID
  ]);
  console.log("✅ Cross-chain purchase verified");

  // Test 10: Check ownership on second chain
  const ownsOnChain2After = await store2.read.ownsItem([
    buyer.account.address,
    "sword-001"
  ]);
  assert.equal(ownsOnChain2After, true, "Should now own item on chain 2");
  console.log("✅ Ownership verified on second chain");

  // Test 11: Verify purchase details on second chain
  const purchase2 = await store2.read.getPurchase([purchaseHash]);
  assert.equal(getAddress(purchase2.buyer), getAddress(buyer.account.address));
  assert.equal(purchase2.itemId, "sword-001");
  assert.equal(purchase2.chainId, 11155111n, "Should record origin chain ID");
  console.log("✅ Cross-chain purchase details correct");

  console.log("\n🎉 Cross-chain flow complete!");
  console.log("   - Purchased on Chain 1 ✅");
  console.log("   - Verified on Chain 2 ✅");
  console.log("   - Ownership works on both chains ✅");
});

test("CrossChainGameStore - Multiple Items and Ownership Check", async () => {
  const { viem } = await network.connect();
  const store = await viem.deployContract("CrossChainGameStore");
  const [owner, buyer] = await viem.getWalletClients();

  console.log("\n📦 Test: Multiple Item Purchases");

  // Buy multiple items
  await store.write.purchaseItem(["sword-001", parseEther("0.001")], {
    value: parseEther("0.001"),
    account: buyer.account
  });

  await store.write.purchaseItem(["shield-002", parseEther("0.0015")], {
    value: parseEther("0.0015"),
    account: buyer.account
  });

  await store.write.purchaseItem(["armor-003", parseEther("0.002")], {
    value: parseEther("0.002"),
    account: buyer.account
  });

  // Check ownership of all items
  const ownsSword = await store.read.ownsItem([buyer.account.address, "sword-001"]);
  const ownsShield = await store.read.ownsItem([buyer.account.address, "shield-002"]);
  const ownsArmor = await store.read.ownsItem([buyer.account.address, "armor-003"]);
  const ownsRandom = await store.read.ownsItem([buyer.account.address, "random-999"]);

  assert.equal(ownsSword, true);
  assert.equal(ownsShield, true);
  assert.equal(ownsArmor, true);
  assert.equal(ownsRandom, false, "Should not own items not purchased");

  // Check purchase count
  const purchases = await store.read.getUserPurchases([buyer.account.address]);
  assert.equal(purchases.length, 3, "Should have 3 purchases");

  console.log("✅ All items purchased and verified");
  console.log(`   - Total purchases: ${purchases.length}`);
});
