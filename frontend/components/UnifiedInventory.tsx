"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatEther } from "viem";
import Image from "next/image";
import { getItemImage } from "@/lib/item-images";
import { InventoryDetailModal } from "./InventoryDetailModal";

// CrossChain ABI with inventory functions
const CROSSCHAIN_ABI = [
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserPurchases",
    outputs: [{ name: "", type: "bytes32[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "purchaseHash", type: "bytes32" }],
    name: "getPurchase",
    outputs: [{
      components: [
        { name: "buyer", type: "address" },
        { name: "itemId", type: "string" },
        { name: "price", type: "uint256" },
        { name: "timestamp", type: "uint256" },
        { name: "chainId", type: "uint256" },
        { name: "verified", type: "bool" }
      ],
      name: "",
      type: "tuple"
    }],
    stateMutability: "view",
    type: "function"
  }
] as const;

// GameStoreV2 event for reading purchases
const GAMESTORE_EVENT_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "buyer", type: "address" },
      { indexed: false, name: "itemId", type: "string" },
      { indexed: false, name: "price", type: "uint256" }
    ],
    name: "ItemPurchased",
    type: "event"
  }
] as const;

interface Purchase {
  buyer: string;
  itemId: string;
  price: bigint;
  timestamp: bigint;
  chainId: bigint;
  verified: boolean;
}

interface EventPurchase {
  itemId: string;
  price: bigint;
  transactionHash: string;
  chainName: string;
  storeType: string;
}

export function UnifiedInventory() {
  const { address, chain } = useAccount();
  const [crossChainPurchases, setCrossChainPurchases] = useState<{ hash: string; purchase: Purchase; chainName: string }[]>([]);
  const [regularPurchases, setRegularPurchases] = useState<EventPurchase[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ itemId: string; chainName: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const crosschainSepoliaAddress = process.env.NEXT_PUBLIC_CROSSCHAIN_ADDRESS_SEPOLIA as `0x${string}`;
  const crosschainBaseAddress = process.env.NEXT_PUBLIC_CROSSCHAIN_ADDRESS_BASE as `0x${string}`;
  const regularSepoliaAddress = process.env.NEXT_PUBLIC_GAMESTORE_ADDRESS_SEPOLIA as `0x${string}`;
  const regularBaseAddress = process.env.NEXT_PUBLIC_GAMESTORE_ADDRESS_BASE as `0x${string}`;

  // Read CrossChain purchases
  const { data: sepoliaCrossChainPurchases } = useReadContract({
    address: crosschainSepoliaAddress,
    abi: CROSSCHAIN_ABI,
    functionName: "getUserPurchases",
    args: address ? [address] : undefined,
    chainId: 11155111,
  });

  const { data: baseCrossChainPurchases } = useReadContract({
    address: crosschainBaseAddress,
    abi: CROSSCHAIN_ABI,
    functionName: "getUserPurchases",
    args: address ? [address] : undefined,
    chainId: 84532,
  });

  // Fetch all purchases
  useEffect(() => {
    async function fetchAllPurchases() {
      if (!address) {
        setCrossChainPurchases([]);
        setRegularPurchases([]);
        return;
      }

      setIsLoading(true);
      const allCrossChain: { hash: string; purchase: Purchase; chainName: string }[] = [];
      const allRegular: EventPurchase[] = [];

      try {
        const { createPublicClient, http } = await import('viem');
        const { sepolia, baseSepolia } = await import('viem/chains');

        const sepoliaClient = createPublicClient({
          chain: sepolia,
          transport: http()
        });

        const baseClient = createPublicClient({
          chain: baseSepolia,
          transport: http()
        });

        // Fetch CrossChain purchases from Sepolia
        if (sepoliaCrossChainPurchases && sepoliaCrossChainPurchases.length > 0) {
          for (const hash of sepoliaCrossChainPurchases) {
            try {
              const purchase = await sepoliaClient.readContract({
                address: crosschainSepoliaAddress,
                abi: CROSSCHAIN_ABI,
                functionName: 'getPurchase',
                args: [hash as `0x${string}`]
              }) as Purchase;

              if (purchase && purchase.itemId) {
                allCrossChain.push({ hash: hash as string, purchase, chainName: 'Sepolia' });
              }
            } catch (error) {
              console.error('Error fetching CrossChain Sepolia purchase:', error);
            }
          }
        }

        // Fetch CrossChain purchases from Base
        if (baseCrossChainPurchases && baseCrossChainPurchases.length > 0) {
          for (const hash of baseCrossChainPurchases) {
            try {
              const purchase = await baseClient.readContract({
                address: crosschainBaseAddress,
                abi: CROSSCHAIN_ABI,
                functionName: 'getPurchase',
                args: [hash as `0x${string}`]
              }) as Purchase;

              if (purchase && purchase.itemId) {
                allCrossChain.push({ hash: hash as string, purchase, chainName: 'Base' });
              }
            } catch (error) {
              console.error('Error fetching CrossChain Base purchase:', error);
            }
          }
        }

        // Fetch Regular Store purchases from events (Sepolia)
        try {
          console.log('🔍 Fetching Regular Store events from Sepolia...');
          console.log('  Address:', regularSepoliaAddress);
          console.log('  Buyer:', address);
          
          const sepoliaLogs = await sepoliaClient.getLogs({
            address: regularSepoliaAddress,
            event: GAMESTORE_EVENT_ABI[0],
            args: { buyer: address },
            fromBlock: BigInt(0),
            toBlock: 'latest'
          });

          console.log('✅ Found', sepoliaLogs.length, 'Regular Sepolia purchases');

          for (const log of sepoliaLogs) {
            if (log.args.itemId && log.args.price) {
              console.log('  Item:', log.args.itemId, 'Price:', log.args.price);
              allRegular.push({
                itemId: log.args.itemId,
                price: log.args.price,
                transactionHash: log.transactionHash,
                chainName: 'Sepolia',
                storeType: 'Regular'
              });
            }
          }
        } catch (error) {
          console.error('❌ Error fetching Regular Sepolia events:', error);
        }

        // Fetch Regular Store purchases from events (Base)
        try {
          console.log('🔍 Fetching Regular Store events from Base...');
          console.log('  Address:', regularBaseAddress);
          console.log('  Buyer:', address);
          
          const baseLogs = await baseClient.getLogs({
            address: regularBaseAddress,
            event: GAMESTORE_EVENT_ABI[0],
            args: { buyer: address },
            fromBlock: BigInt(0),
            toBlock: 'latest'
          });

          console.log('✅ Found', baseLogs.length, 'Regular Base purchases');

          for (const log of baseLogs) {
            if (log.args.itemId && log.args.price) {
              console.log('  Item:', log.args.itemId, 'Price:', log.args.price);
              allRegular.push({
                itemId: log.args.itemId,
                price: log.args.price,
                transactionHash: log.transactionHash,
                chainName: 'Base',
                storeType: 'Regular'
              });
            }
          }
        } catch (error) {
          console.error('❌ Error fetching Regular Base events:', error);
        }

        console.log('📊 Inventory Summary:');
        console.log('  CrossChain items:', allCrossChain.length);
        console.log('  Regular items:', allRegular.length);
        console.log('  Total items:', allCrossChain.length + allRegular.length);
        
        setCrossChainPurchases(allCrossChain);
        setRegularPurchases(allRegular);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllPurchases();
  }, [sepoliaCrossChainPurchases, baseCrossChainPurchases, address, crosschainSepoliaAddress, crosschainBaseAddress, regularSepoliaAddress, regularBaseAddress]);

  const getItemIcon = (itemId: string) => {
    if (itemId === 'sword-001') return '⚔️';
    if (itemId === 'sword-002') return '⚔️';
    if (itemId === 'sword-003') return '✨';
    if (itemId === 'sword-004') return '🐉';
    if (itemId === 'sword-005') return '⚔️';
    if (itemId === 'sword-006') return '🌟';
    if (itemId === 'sword-007') return '✨';
    if (itemId === 'weapon-001') return '🏹';
    if (itemId === 'weapon-002') return '🔫';
    if (itemId === 'weapon-003') return '🪄';
    if (itemId === 'claw-001') return '🦅';
    if (itemId === 'claw-002') return '🦾';
    if (itemId === 'reaper-001') return '💀';
    if (itemId === 'twin-001') return '⚔️';
    return '🎮';
  };

  const getItemName = (itemId: string) => {
    if (itemId === 'sword-001') return 'Black Katana';
    if (itemId === 'sword-002') return 'Dark Sword';
    if (itemId === 'sword-003') return 'Rune Blade';
    if (itemId === 'sword-004') return 'Dragon Dragger';
    if (itemId === 'sword-005') return 'Artis Sword';
    if (itemId === 'sword-006') return 'Cosmic Sword';
    if (itemId === 'sword-007') return 'Ether Sword';
    if (itemId === 'weapon-001') return 'Dark Bow';
    if (itemId === 'weapon-002') return 'Dragon Shot';
    if (itemId === 'weapon-003') return 'Magic Pistol';
    if (itemId === 'claw-001') return 'Rune Claw';
    if (itemId === 'claw-002') return 'Steel Claw';
    if (itemId === 'reaper-001') return 'Blood Reaper';
    if (itemId === 'twin-001') return 'Heavenly Twin Sword';
    return itemId;
  };

  const totalItems = crossChainPurchases.length + regularPurchases.length;

  if (!address) {
    return (
      <div className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-white/20 shadow-2xl">
        <p className="text-gray-100 text-center text-shadow">Connect wallet to view your inventory</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Your Complete Inventory
        </h2>
        <div className="flex gap-2 text-sm">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
            {regularPurchases.length} Regular
          </span>
          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
            {crossChainPurchases.length} Cross-Chain
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-white/20 shadow-2xl">
          <p className="text-cyan-300 text-center">Loading your items from all chains...</p>
        </div>
      ) : totalItems === 0 ? (
        <div className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-cyan-300">No items found in your inventory.</p>
            <p className="text-gray-400 text-sm mt-2">Make a purchase to see items here!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* CrossChain Purchases */}
          {crossChainPurchases.map((item, index) => {
            const { hash, purchase, chainName } = item;
            const imagePath = getItemImage(purchase.itemId);
            const isSepoliaChain = chainName === 'Sepolia';
            const gradientColors = isSepoliaChain ? 'from-blue-600/80 to-cyan-600/80' : 'from-cyan-600/80 to-teal-600/80';

            return (
              <div 
                key={`crosschain-${chainName}-${index}`} 
                className="bg-black/40 backdrop-blur-xl rounded-xl overflow-hidden border border-cyan-400/40 hover:border-cyan-400/60 transition-all cursor-pointer hover:scale-105 shadow-2xl hover:shadow-cyan-500/30"
                onClick={() => setSelectedItem({ itemId: purchase.itemId, chainName })}
              >
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-1 bg-cyan-500/30 text-cyan-200 text-xs rounded-full border border-cyan-400/50 font-semibold">
                    🌐 Cross-Chain
                  </span>
                </div>
                <div className={`relative h-56 bg-gradient-to-br ${gradientColors}`}>
                  {imagePath ? (
                    <Image src={imagePath} alt={getItemName(purchase.itemId)} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-7xl">{getItemIcon(purchase.itemId)}</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 ${isSepoliaChain ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'} text-xs rounded-full border`}>
                      {chainName}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-cyan-300">{getItemName(purchase.itemId)}</h3>
                  <p className="text-gray-300 text-xs mb-3 line-clamp-1">Tx: {hash.slice(0, 10)}...{hash.slice(-8)}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-cyan-300">{formatEther(purchase.price)} ETH</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedItem({ itemId: purchase.itemId, chainName }); }}
                    className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-semibold rounded-lg transition-all shadow-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}

          {/* Regular Store Purchases */}
          {regularPurchases.map((item, index) => {
            const imagePath = getItemImage(item.itemId);
            const isSepoliaChain = item.chainName === 'Sepolia';
            const gradientColors = isSepoliaChain ? 'from-purple-600/80 to-pink-600/80' : 'from-pink-600/80 to-rose-600/80';

            return (
              <div 
                key={`regular-${item.chainName}-${index}`} 
                className="bg-black/40 backdrop-blur-xl rounded-xl overflow-hidden border border-purple-400/40 hover:border-purple-400/60 transition-all cursor-pointer hover:scale-105 shadow-2xl hover:shadow-purple-500/30"
                onClick={() => setSelectedItem({ itemId: item.itemId, chainName: item.chainName })}
              >
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-1 bg-purple-500/30 text-purple-200 text-xs rounded-full border border-purple-400/50 font-semibold">
                    🛒 Regular
                  </span>
                </div>
                <div className={`relative h-56 bg-gradient-to-br ${gradientColors}`}>
                  {imagePath ? (
                    <Image src={imagePath} alt={getItemName(item.itemId)} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-7xl">{getItemIcon(item.itemId)}</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 ${isSepoliaChain ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-pink-500/20 text-pink-300 border-pink-500/30'} text-xs rounded-full border`}>
                      {item.chainName}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-purple-300">{getItemName(item.itemId)}</h3>
                  <p className="text-gray-300 text-xs mb-3 line-clamp-1">Tx: {item.transactionHash.slice(0, 10)}...{item.transactionHash.slice(-8)}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-purple-300">{formatEther(item.price)} ETH</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedItem({ itemId: item.itemId, chainName: item.chainName }); }}
                    className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-semibold rounded-lg transition-all shadow-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-blue-300 font-semibold text-sm mb-1">Unified Inventory!</p>
            <p className="text-gray-400 text-xs">
              Showing purchases from both Regular Store (purple) and Cross-Chain Store (cyan) across all supported chains.
            </p>
          </div>
        </div>
      </div>

      {selectedItem && (
        <InventoryDetailModal
          itemId={selectedItem.itemId}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          chainName={selectedItem.chainName}
        />
      )}
    </div>
  );
}
