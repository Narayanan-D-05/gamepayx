import { network } from "hardhat";

async function main() {
  const { viem } = await network.connect();
  const store = await viem.deployContract("GameStoreV2");
  console.log("GameStoreV2 deployed to:", store.address);
  console.log("✅ Contract has withdrawal functionality!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
