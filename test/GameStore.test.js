import test from "node:test";
import assert from "node:assert/strict";
import { network } from "hardhat";
import { parseEther, getAddress } from "viem";

test("GameStore deployment and purchase flow", async () => {
  const { viem } = await network.connect();
  const store = await viem.deployContract("GameStore");

  const [buyer] = await viem.getWalletClients();
  const price = parseEther("0.1");

  // Test successful purchase with correct value
  await viem.assertions.emitWithArgs(
    store.write.purchaseItem(["sword-001", price], { value: price, account: buyer.account }),
    store,
    "ItemPurchased",
    [getAddress(buyer.account.address), "sword-001", price]
  );

  // Verify contract address is valid
  assert.ok(store.address);
  assert.match(store.address, /^0x[a-fA-F0-9]{40}$/);
});
