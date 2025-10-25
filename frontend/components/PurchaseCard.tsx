"use client";

import { useState } from "react";
import { parseEther } from "viem";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";

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
  imageUrl: string;
}

export function PurchaseCard({ itemId, itemName, itemDescription, price, imageUrl }: PurchaseCardProps) {
  const { chain } = useAccount();
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  const contractAddress = chain?.id === 11155111 
    ? (process.env.NEXT_PUBLIC_GAMESTORE_ADDRESS_SEPOLIA as `0x${string}`)
    : (process.env.NEXT_PUBLIC_GAMESTORE_ADDRESS_BASE as `0x${string}`);

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
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-white mb-2">Purchase Successful!</h3>
          <p className="text-gray-300 mb-4">{itemName} is now yours</p>
          <a
            href={`https://${chain?.id === 11155111 ? 'sepolia.etherscan.io' : 'sepolia.basescan.org'}/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline text-sm"
          >
            View Transaction
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-all">
      <div className="h-48 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <span className="text-6xl">⚔️</span>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{itemName}</h3>
        <p className="text-gray-300 text-sm mb-4">{itemDescription}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-white">{price} ETH</span>
          <span className="text-sm text-gray-400">
            {chain?.name || "Connect Wallet"}
          </span>
        </div>

        <button
          onClick={handlePurchase}
          disabled={isPurchasing || isConfirming || !contractAddress}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConfirming ? "Confirming..." : isPurchasing ? "Processing..." : "Purchase Item"}
        </button>

        {!contractAddress && (
          <p className="text-red-400 text-xs mt-2 text-center">
            Contract not deployed on this network
          </p>
        )}
      </div>
    </div>
  );
}
