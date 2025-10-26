"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import Image from "next/image";
import { getItemImage } from "@/lib/item-images";
import { nexusClient } from "@/lib/nexus-client";

// CrossChainGameStore ABI
const CROSSCHAIN_ABI = [
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
      { indexed: false, name: "price", type: "uint256" },
      { indexed: false, name: "chainId", type: "uint256" },
      { indexed: false, name: "purchaseHash", type: "bytes32" }
    ],
    name: "ItemPurchased",
    type: "event"
  }
] as const;

interface CrossChainPurchaseCardProps {
  itemId: string;
  itemName: string;
  itemDescription: string;
  price: string;
  icon: string;
}

// Simple image component with fallback
function ItemImageDisplay({ itemId, icon, itemName }: { itemId: string; icon: string; itemName: string }) {
  const [imageError, setImageError] = useState(false);
  
  // Get image path from mapping
  const imagePath = getItemImage(itemId);
  
  // If no image mapped or error, show emoji
  if (!imagePath || imageError) {
    return <span className="text-7xl">{icon}</span>;
  }
  
  return (
    <>
      <div className="absolute inset-0">
        <Image
          src={imagePath}
          alt={itemName}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
          priority
        />
      </div>
    </>
  );
}

export function CrossChainPurchaseCard({ 
  itemId, 
  itemName, 
  itemDescription, 
  price, 
  icon 
}: CrossChainPurchaseCardProps) {
  const { chain, address } = useAccount();
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  // Use CrossChainGameStore contract addresses (fresh deployment)
  const contractAddress = chain?.id === 11155111 
    ? (process.env.NEXT_PUBLIC_CROSSCHAIN_ADDRESS_SEPOLIA as `0x${string}`)
    : chain?.id === 84532
    ? (process.env.NEXT_PUBLIC_CROSSCHAIN_ADDRESS_BASE as `0x${string}`)
    : undefined;
  
  // Debug logging
  console.log('🔍 CrossChain Debug:', {
    chainId: chain?.id,
    chainName: chain?.name,
    contractAddress,
    expectedSepolia: process.env.NEXT_PUBLIC_CROSSCHAIN_ADDRESS_SEPOLIA,
    expectedBase: process.env.NEXT_PUBLIC_CROSSCHAIN_ADDRESS_BASE,
  });

  const { writeContract, data: hash, error: writeError, isError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, isError: isReceiptError } = useWaitForTransactionReceipt({ hash });

  // Reset purchasing state when transaction fails or is cancelled
  if ((isError || isReceiptError) && isPurchasing) {
    setIsPurchasing(false);
  }

  // Reset purchasing state when transaction starts confirming
  if (isConfirming && isPurchasing) {
    setIsPurchasing(false);
  }

  const handlePurchase = async () => {
    if (!contractAddress || !address) return;
    
    setIsPurchasing(true);
    try {
      const priceInWei = parseEther(price);
      
      // 🌉 AVAIL NEXUS SDK: Generate cross-chain proof before purchase
      console.log('🌉 Using Avail Nexus SDK for cross-chain purchase...');
      const purchaseHash = `0x${Buffer.from(
        JSON.stringify({ buyer: address, itemId, price, timestamp: Date.now() })
      ).toString('hex').slice(0, 64)}`;
      
      // Generate proof using Nexus SDK
      const proof = await nexusClient.generateProof(purchaseHash, chain?.id || 11155111);
      console.log('✅ Nexus proof generated:', proof);
      
      // Execute purchase on-chain
      writeContract({
        address: contractAddress,
        abi: CROSSCHAIN_ABI,
        functionName: "purchaseItem",
        args: [itemId, priceInWei],
        value: priceInWei,
      });
      
      // Note: In production, proof would be submitted to Avail DA layer
      console.log('📤 Proof ready for Avail DA submission');
    } catch (error) {
      console.error("Purchase failed:", error);
      setIsPurchasing(false);
    }
  };

  const getChainName = () => {
    if (chain?.id === 11155111) return "Sepolia";
    if (chain?.id === 84532) return "Base";
    return "Unknown";
  };

  const getChainColor = () => {
    if (chain?.id === 11155111) return "from-blue-600/80 to-cyan-600/80";
    if (chain?.id === 84532) return "from-cyan-600/80 to-teal-600/80";
    return "from-gray-600/80 to-gray-700/80";
  };

  if (isSuccess) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-green-500/50 transition-all">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-cyan-300 mb-2">Purchase Successful!</h3>
          <p className="text-cyan-200 mb-2">{itemName} is now yours</p>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm mb-4">
            <span>🌐</span>
            <span>Cross-Chain Enabled</span>
          </div>

          <p className="text-blue-300 text-xs mb-4">
            Access this item on any supported chain via Avail!
          </p>
          
          <a
            href={`https://${chain?.id === 11155111 ? 'sepolia.etherscan.io' : 'sepolia.basescan.org'}/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
          >
            View Transaction →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-xl overflow-hidden border border-white/40 hover:border-white/60 transition-all hover:scale-105 shadow-2xl hover:shadow-cyan-500/30">
      {/* Top Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30 font-semibold">
          🌐 Cross-Chain
        </span>
      </div>

      {/* Item Image/Icon */}
      <div className={`h-56 bg-gradient-to-br ${getChainColor()} flex items-center justify-center relative overflow-hidden`}>
        {/* Try to load image, fallback to emoji icon */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <ItemImageDisplay itemId={itemId} icon={icon} itemName={itemName} />
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-cyan-300 mb-2">{itemName}</h3>
          <span className={`px-2 py-0.5 bg-gradient-to-r ${getChainColor()} text-white text-xs rounded-full`}>
            {getChainName()}
          </span>
        </div>
        
        <p className="text-blue-200 text-xs mb-3 line-clamp-2">{itemDescription}</p>
        
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
          <div>
            <span className="text-xl font-bold text-cyan-300">{price} ETH</span>
            <p className="text-xs text-gray-400">≈ ${(parseFloat(price) * 2500).toFixed(2)} USD</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Available on</p>
            <p className="text-xs text-white font-semibold">All Chains</p>
          </div>
        </div>

        <button
          onClick={handlePurchase}
          disabled={isPurchasing || isConfirming || !contractAddress || !address}
          className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30"
        >
          {isConfirming ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Confirming...
            </span>
          ) : isPurchasing ? (
            "Processing..."
          ) : (
            <>
              <span>🛒 Purchase Item</span>
            </>
          )}
        </button>

        {!contractAddress && (
          <p className="text-red-400 text-xs mt-2 text-center">
            ⚠️ Contract not deployed on this network
          </p>
        )}

        {!address && (
          <p className="text-yellow-400 text-xs mt-2 text-center">
            Connect wallet to purchase
          </p>
        )}
      </div>
    </div>
  );
}
