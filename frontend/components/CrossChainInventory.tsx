"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatEther } from "viem";
import Image from "next/image";
import { getItemImage } from "@/lib/item-images";
import { InventoryDetailModal } from "./InventoryDetailModal";

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

interface Purchase {
  buyer: string;
  itemId: string;
  price: bigint;
  timestamp: bigint;
  chainId: bigint;
  verified: boolean;
}

export function CrossChainInventory() {
  const { address, chain } = useAccount();
  const [purchases, setPurchases] = useState<{ hash: string; purchase: Purchase; chainName: string }[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ itemId: string; chainName: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sepoliaAddress = process.env.NEXT_PUBLIC_CROSSCHAIN_ADDRESS_SEPOLIA as `0x${string}`;
  const baseAddress = process.env.NEXT_PUBLIC_CROSSCHAIN_ADDRESS_BASE as `0x${string}`;

  // Read purchases from Sepolia
  const { data: sepoliaPurchases, refetch: refetchSepolia } = useReadContract({
    address: sepoliaAddress,
    abi: CROSSCHAIN_ABI,
    functionName: "getUserPurchases",
    args: address ? [address] : undefined,
    chainId: 11155111,
  });

  // Read purchases from Base
  const { data: basePurchases, refetch: refetchBase } = useReadContract({
    address: baseAddress,
    abi: CROSSCHAIN_ABI,
    functionName: "getUserPurchases",
    args: address ? [address] : undefined,
    chainId: 84532,
  });

  // Fetch purchase details using contract calls
  useEffect(() => {
    async function fetchPurchaseDetails() {
      if (!address) {
        setPurchases([]);
        return;
      }

      setIsLoading(true);
      const allPurchases: { hash: string; purchase: Purchase; chainName: string }[] = [];

      try {
        // Import viem for contract reads
        const { createPublicClient, http } = await import('viem');
        const { sepolia, baseSepolia } = await import('viem/chains');

        // Create clients
        const sepoliaClient = createPublicClient({
          chain: sepolia,
          transport: http()
        });

        const baseClient = createPublicClient({
          chain: baseSepolia,
          transport: http()
        });

        // Fetch Sepolia purchase details
        if (sepoliaPurchases && sepoliaPurchases.length > 0) {
          for (const hash of sepoliaPurchases) {
            try {
              const purchase = await sepoliaClient.readContract({
                address: sepoliaAddress,
                abi: CROSSCHAIN_ABI,
                functionName: 'getPurchase',
                args: [hash as `0x${string}`]
              }) as Purchase;

              if (purchase && purchase.itemId) {
                allPurchases.push({
                  hash: hash as string,
                  purchase,
                  chainName: 'Sepolia'
                });
              }
            } catch (error) {
              console.error('Error fetching Sepolia purchase:', hash, error);
            }
          }
        }

        // Fetch Base purchase details
        if (basePurchases && basePurchases.length > 0) {
          for (const hash of basePurchases) {
            try {
              const purchase = await baseClient.readContract({
                address: baseAddress,
                abi: CROSSCHAIN_ABI,
                functionName: 'getPurchase',
                args: [hash as `0x${string}`]
              }) as Purchase;

              if (purchase && purchase.itemId) {
                allPurchases.push({
                  hash: hash as string,
                  purchase,
                  chainName: 'Base'
                });
              }
            } catch (error) {
              console.error('Error fetching Base purchase:', hash, error);
            }
          }
        }

        setPurchases(allPurchases);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPurchaseDetails();
  }, [sepoliaPurchases, basePurchases, address, sepoliaAddress, baseAddress]);

  const getItemIcon = (itemId: string) => {
    // Swords
    if (itemId === 'sword-001') return '⚔️';
    if (itemId === 'sword-002') return '⚔️';
    if (itemId === 'sword-003') return '✨';
    if (itemId === 'sword-004') return '🐉';
    if (itemId === 'sword-005') return '⚔️';
    if (itemId === 'sword-006') return '🌟';
    if (itemId === 'sword-007') return '✨';
    
    // Weapons
    if (itemId === 'weapon-001') return '🏹';
    if (itemId === 'weapon-002') return '🔫';
    if (itemId === 'weapon-003') return '🪄';
    
    // Claws
    if (itemId === 'claw-001') return '🦅';
    if (itemId === 'claw-002') return '🦾';
    
    // Special
    if (itemId === 'reaper-001') return '💀';
    if (itemId === 'twin-001') return '⚔️';
    
    // Legacy items
    if (itemId.includes('shield')) return '🛡️';
    if (itemId.includes('armor')) return '🦾';
    
    return '🎮';
  };

  const getItemName = (itemId: string) => {
    // Swords
    if (itemId === 'sword-001') return 'Black Katana';
    if (itemId === 'sword-002') return 'Dark Sword';
    if (itemId === 'sword-003') return 'Rune Blade';
    if (itemId === 'sword-004') return 'Dragon Dragger';
    if (itemId === 'sword-005') return 'Artis Sword';
    if (itemId === 'sword-006') return 'Cosmic Sword';
    if (itemId === 'sword-007') return 'Ether Sword';
    
    // Weapons
    if (itemId === 'weapon-001') return 'Dark Bow';
    if (itemId === 'weapon-002') return 'Dragon Shot';
    if (itemId === 'weapon-003') return 'Magic Pistol';
    
    // Claws
    if (itemId === 'claw-001') return 'Rune Claw';
    if (itemId === 'claw-002') return 'Steel Claw';
    
    // Special
    if (itemId === 'reaper-001') return 'Blood Reaper';
    if (itemId === 'twin-001') return 'Heavenly Twin Sword';
    
    // Legacy items (if old purchases exist)
    if (itemId.includes('shield')) return 'Dragon Shield';
    if (itemId.includes('armor')) return 'Mythic Armor';
    
    return itemId;
  };

  const getChainBadge = (chainId: bigint) => {
    const sepoliaChainId = BigInt(11155111);
    const baseChainId = BigInt(84532);
    
    if (chainId === sepoliaChainId) {
      return (
        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
          Sepolia
        </span>
      );
    }
    if (chainId === baseChainId) {
      return (
        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-500/30">
          Base
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full">
        Chain {chainId.toString()}
      </span>
    );
  };

  if (!address) {
    return (
      <div className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-white/20 shadow-2xl">
        <p className="text-gray-100 text-center text-shadow">Connect wallet to view your cross-chain inventory</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8 text-center">Your Inventory</h2>
      <p className="text-center text-gray-300 text-sm mb-6">
        Showing items purchased from the Cross-Chain Store
      </p>

      {isLoading ? (
        <div className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-white/20 shadow-2xl">
          <p className="text-cyan-300 text-center">Loading your items from all chains...</p>
        </div>
      ) : purchases.length === 0 ? (
        <div className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-cyan-300">No items found in your inventory.</p>
            <p className="text-gray-400 text-sm mt-2">Make a purchase to see items here!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {purchases.map((item, index) => {
            const { hash, purchase, chainName } = item;
            const itemId = purchase.itemId;
            const imagePath = getItemImage(itemId);
              
              const isSepoliaChain = chainName === 'Sepolia';
            const gradientColors = isSepoliaChain 
              ? 'from-blue-600/80 to-cyan-600/80' 
              : 'from-cyan-600/80 to-teal-600/80';

            return (
                <div 
                  key={`${chainName}-${index}`} 
                  className="bg-black/40 backdrop-blur-xl rounded-xl overflow-hidden border border-white/40 hover:border-white/60 transition-all cursor-pointer hover:scale-105 shadow-2xl hover:shadow-cyan-500/30"
                  onClick={() => setSelectedItem({ itemId, chainName })}
                >
                  {/* Item Image */}
                  <div className={`relative h-56 bg-gradient-to-br ${gradientColors}`}>
                    {imagePath ? (
                      <Image
                        src={imagePath}
                        alt={getItemName(itemId)}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-7xl">{getItemIcon(itemId)}</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      {getChainBadge(purchase.chainId)}
                    </div>
                  </div>
                  
                  {/* Item Details */}
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-cyan-300">{getItemName(itemId)}</h3>
                    <p className="text-gray-300 text-xs mb-3 line-clamp-1">
                      Tx: {hash.slice(0, 10)}...{hash.slice(-8)}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-cyan-300">{formatEther(purchase.price)} ETH</span>
                      <span className="text-xs text-gray-400">
                        {chainName}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem({ itemId, chainName });
                      }}
                      className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-cyan-500/30"
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
            <p className="text-blue-300 font-semibold text-sm mb-1">Cross-Chain Inventory</p>
            <p className="text-gray-400 text-xs">
              This inventory shows items from the Cross-Chain Store only. Items are accessible on all supported chains via Avail verification. To see all purchases including Regular Store items, check transaction history on block explorers.
            </p>
          </div>
        </div>
      </div>

      {/* Lighthouse Inventory Detail Modal */}
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
