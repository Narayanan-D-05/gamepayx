"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import Image from "next/image";
import { getItemImage } from "@/lib/item-images";

const GAMESTORE_ABI = [
  {
    inputs: [
      { name: "itemId", type: "string" },
      { name: "price", type: "uint256" }
    ],
    name: "purchaseItem",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
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

interface PurchaseCardProps {
  itemId: string;
  itemName: string;
  itemDescription: string;
  price: string;
  imageUrl?: string; // Optional - will use getItemImage() if not provided
}

export function PurchaseCard({ itemId, itemName, itemDescription, price, imageUrl }: PurchaseCardProps) {
  const { chain } = useAccount();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Get image path from mapping
  const imagePath = getItemImage(itemId);
  
  // Use GameStoreV2 contract addresses with explicit chain checking
  const contractAddress = chain?.id === 11155111 
    ? (process.env.NEXT_PUBLIC_GAMESTORE_ADDRESS_SEPOLIA as `0x${string}`)
    : chain?.id === 84532
    ? (process.env.NEXT_PUBLIC_GAMESTORE_ADDRESS_BASE as `0x${string}`)
    : undefined;
  
  // Debug logging
  console.log('🔍 Purchase Debug:', {
    chainId: chain?.id,
    chainName: chain?.name,
    contractAddress,
    expectedSepolia: process.env.NEXT_PUBLIC_GAMESTORE_ADDRESS_SEPOLIA,
    expectedBase: process.env.NEXT_PUBLIC_GAMESTORE_ADDRESS_BASE,
  });

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handlePurchase = async () => {
    if (!contractAddress) return;
    
    setIsPurchasing(true);
    try {
      const priceInWei = parseEther(price);
      
      writeContract({
        address: contractAddress,
        abi: GAMESTORE_ABI,
        functionName: "purchaseItem",
        args: [itemId, priceInWei],
        value: priceInWei,
      });
    } catch (error) {
      console.error("Purchase failed:", error);
      setIsPurchasing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-black/40 backdrop-blur-xl rounded-xl p-6 border border-white/30 shadow-2xl">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-cyan-300 mb-2 text-shadow">Purchase Successful!</h3>
          <p className="text-cyan-200 mb-2">{itemName} is now yours</p>
          <p className="text-blue-200 text-sm mb-4">{itemDescription}</p>
          <a
            href={`https://${
              chain?.id === 11155111 
                ? 'sepolia.etherscan.io' 
                : chain?.id === 84532 
                ? 'sepolia.basescan.org' 
                : 'etherscan.io'
            }/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline text-sm"
          >
            View on {chain?.id === 11155111 ? 'Sepolia Etherscan' : chain?.id === 84532 ? 'Base Sepolia Explorer' : 'Explorer'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-xl overflow-hidden border border-white/40 hover:border-white/60 transition-all hover:scale-105 shadow-2xl hover:shadow-cyan-500/30">
      <div className="h-56 bg-gradient-to-br from-blue-600/80 to-cyan-600/80 flex items-center justify-center relative overflow-hidden">
        {imagePath && !imageError ? (
          <Image
            src={imagePath}
            alt={itemName}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            priority
          />
        ) : (
          <span className="text-6xl">⚔️</span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-cyan-300 mb-2">{itemName}</h3>
        <p className="text-gray-300 text-xs mb-3 line-clamp-1">{itemDescription}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-cyan-300">{price} ETH</span>
          <span className="text-xs text-gray-400">
            {chain?.name || "Connect Wallet"}
          </span>
        </div>

        <button
          onClick={handlePurchase}
          disabled={isPurchasing || isConfirming || !contractAddress}
          className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30"
        >
          {isConfirming ? "Confirming..." : isPurchasing ? "Processing..." : "Purchase Item"}
        </button>

        {!contractAddress && chain && (
          <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded">
            <p className="text-red-400 text-xs text-center font-semibold mb-1">
              ⚠️ Wrong Network
            </p>
            <p className="text-red-300 text-xs text-center">
              Please switch to Sepolia (11155111) or Base Sepolia (84532)
            </p>
            <p className="text-gray-400 text-xs text-center mt-1">
              Current: {chain.name} ({chain.id})
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
