import test from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";
import { parseEther, getAddress, formatEther } from "viem";

test("GameStoreV2 - Purchase and Withdrawal Flow", async () => {
  const { viem } = await network.connect();
  const store = await viem.deployContract("GameStoreV2");
  const publicClient = await viem.getPublicClient();

  const [owner, buyer] = await viem.getWalletClients();
  const price = parseEther("0.1");

  console.log("\n📦 Test: Purchase and Withdrawal");
  console.log(`📍 Contract: ${store.address}`);
  console.log(`👤 Owner: ${owner.account.address}`);
  console.log(`🛒 Buyer: ${buyer.account.address}`);

  // Test 1: Verify owner is set correctly
  const contractOwner = await store.read.owner();
  assert.equal(
    getAddress(contractOwner),
    getAddress(owner.account.address),
    "Owner should be deployer"
  );
  console.log("✅ Owner verified");

  // Test 2: Check initial balance is zero
  const initialBalance = await store.read.getBalance();
  assert.equal(initialBalance, 0n, "Initial balance should be 0");
  console.log("✅ Initial balance is 0");

  // Test 3: Purchase item (buyer sends ETH to contract)
  await viem.assertions.emitWithArgs(
    store.write.purchaseItem(["sword-001", price], { 
      value: price, 
      account: buyer.account 
    }),
    store,
    "ItemPurchased",
    [getAddress(buyer.account.address), "sword-001", price]
  );
  console.log("✅ Purchase successful, ItemPurchased event emitted");

  // Test 4: Verify contract received the funds
  const balanceAfterPurchase = await store.read.getBalance();
  assert.equal(balanceAfterPurchase, price, "Contract should have received payment");
  console.log(`✅ Contract balance: ${formatEther(balanceAfterPurchase)} ETH`);

  // Test 5: Non-owner cannot withdraw
  try {
    await store.write.withdraw({ account: buyer.account });
    assert.fail("Non-owner should not be able to withdraw");
  } catch (error) {
    assert.ok(error.message.includes("Only owner"), "Should reject non-owner withdrawal");
    console.log("✅ Non-owner withdrawal blocked");
  }

  // Test 6: Owner can withdraw funds
  const ownerBalanceBefore = await publicClient.getBalance({ 
    address: owner.account.address 
  });

  await viem.assertions.emitWithArgs(
    store.write.withdraw({ account: owner.account }),
    store,
    "FundsWithdrawn",
    [getAddress(owner.account.address), price]
  );
  console.log("✅ Withdrawal successful, FundsWithdrawn event emitted");

  // Test 7: Verify contract balance is now zero
  const balanceAfterWithdrawal = await store.read.getBalance();
  assert.equal(balanceAfterWithdrawal, 0n, "Contract balance should be 0 after withdrawal");
  console.log("✅ Contract emptied successfully");

  // Test 8: Verify owner received the funds
  const ownerBalanceAfter = await publicClient.getBalance({ 
    address: owner.account.address 
  });
  // Owner balance should increase (minus gas costs)
  assert.ok(
    ownerBalanceAfter > ownerBalanceBefore,
    "Owner balance should increase after withdrawal"
  );
  console.log(`✅ Owner received funds (minus gas)`);

  // Test 9: Cannot withdraw when balance is zero
  try {
    await store.write.withdraw({ account: owner.account });
    assert.fail("Should not be able to withdraw with 0 balance");
  } catch (error) {
    assert.ok(
      error.message.includes("No funds to withdraw"),
      "Should reject withdrawal with no funds"
    );
    console.log("✅ Empty withdrawal blocked");
  }

  // Test 10: Test partial withdrawal
  // Make another purchase
  await store.write.purchaseItem(["shield-001", price], { 
    value: price, 
    account: buyer.account 
  });

  const halfPrice = price / 2n;
  await viem.assertions.emitWithArgs(
    store.write.withdrawAmount([halfPrice], { account: owner.account }),
    store,
    "FundsWithdrawn",
    [getAddress(owner.account.address), halfPrice]
  );

  const remainingBalance = await store.read.getBalance();
  assert.equal(
    remainingBalance, 
    halfPrice, 
    "Half should remain after partial withdrawal"
  );
  console.log("✅ Partial withdrawal works correctly");

  console.log("\n🎉 All withdrawal tests passed!\n");
});

test("GameStoreV2 - Ownership Transfer", async () => {
  const { viem } = await network.connect();
  const store = await viem.deployContract("GameStoreV2");

  const [owner, newOwner] = await viem.getWalletClients();

  console.log("\n🔄 Test: Ownership Transfer");

  // Verify initial owner
  let currentOwner = await store.read.owner();
  assert.equal(
    getAddress(currentOwner),
    getAddress(owner.account.address)
  );
  console.log("✅ Initial owner verified");

  // Transfer ownership
  await store.write.transferOwnership([newOwner.account.address], {
    account: owner.account
  });

  // Verify new owner
  currentOwner = await store.read.owner();
  assert.equal(
    getAddress(currentOwner),
    getAddress(newOwner.account.address)
  );
  console.log("✅ Ownership transferred successfully");

  // Old owner cannot withdraw anymore
  const price = parseEther("0.1");
  await store.write.purchaseItem(["armor-001", price], { 
    value: price, 
    account: owner.account 
  });

  try {
    await store.write.withdraw({ account: owner.account });
    assert.fail("Old owner should not be able to withdraw");
  } catch (error) {
    assert.ok(error.message.includes("Only owner"));
    console.log("✅ Old owner blocked from withdrawal");
  }

  // New owner can withdraw
  await store.write.withdraw({ account: newOwner.account });
  const balance = await store.read.getBalance();
  assert.equal(balance, 0n);
  console.log("✅ New owner can withdraw");

  console.log("\n🎉 Ownership transfer tests passed!\n");
});
