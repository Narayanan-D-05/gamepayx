"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import Image from "next/image";
import { getItemImage } from "@/lib/item-images";

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
  
  const contractAddress = chain?.id === 11155111 
    ? (process.env.NEXT_PUBLIC_CROSSCHAIN_GAMESTORE_ADDRESS_SEPOLIA as `0x${string}`)
    : (process.env.NEXT_PUBLIC_CROSSCHAIN_GAMESTORE_ADDRESS_BASE as `0x${string}`);

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handlePurchase = async () => {
    if (!contractAddress) return;
    
    setIsPurchasing(true);
    try {
      const priceInWei = parseEther(price);
      
      writeContract({
        address: contractAddress,
        abi: CROSSCHAIN_ABI,
        functionName: "purchaseItem",
        args: [itemId, priceInWei],
        value: priceInWei,
      });
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
    if (chain?.id === 84532) return "from-purple-600/80 to-pink-600/80";
    return "from-gray-600/80 to-gray-700/80";
  };

  if (isSuccess) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-green-500/50 transition-all">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-white mb-2">Purchase Successful!</h3>
          <p className="text-gray-300 mb-2">{itemName} is now yours</p>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm mb-4">
            <span>🌐</span>
            <span>Cross-Chain Enabled</span>
          </div>

          <p className="text-gray-400 text-xs mb-4">
            Accessible on all chains via Avail verification
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
    <div className="bg-black/30 backdrop-blur-xl rounded-xl overflow-hidden border border-white/30 hover:border-white/50 transition-all shadow-2xl hover:shadow-purple-500/20 group">
      {/* Top Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30 font-semibold">
          🌐 Cross-Chain
        </span>
      </div>

      {/* Item Image/Icon */}
      <div className={`h-56 bg-gradient-to-br ${getChainColor()} flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
        {/* Try to load image, fallback to emoji icon */}
        <div className="relative z-10 group-hover:scale-110 transition-transform w-full h-full flex items-center justify-center">
          <ItemImageDisplay itemId={itemId} icon={icon} itemName={itemName} />
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-white">{itemName}</h3>
          <span className={`px-2 py-0.5 bg-gradient-to-r ${getChainColor()} text-white text-xs rounded-full`}>
            {getChainName()}
          </span>
        </div>
        
        <p className="text-gray-300 text-xs mb-3 line-clamp-1">{itemDescription}</p>
        
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
          <div>
            <span className="text-xl font-bold text-white">{price} ETH</span>
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
          className="w-full py-2 bg-white hover:bg-gray-100 text-black text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
