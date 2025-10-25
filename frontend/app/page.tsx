"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { PurchaseCard } from "@/components/PurchaseCard";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <nav className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">PayX Game Store</h1>
          {isConnected ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <button
                onClick={() => disconnect()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => connectors[0] && connect({ connector: connectors[0] })}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            In-Game Items Marketplace
          </h2>
          <p className="text-xl text-gray-300">
            Purchase items cross-chain with Avail Nexus
          </p>
        </div>

        {isConnected ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <PurchaseCard
              itemId="sword-001"
              itemName="Legendary Sword"
              itemDescription="A powerful sword forged in the depths of Mount Doom"
              price="0.001"
              imageUrl="/items/sword.png"
            />
            <PurchaseCard
              itemId="shield-001"
              itemName="Dragon Shield"
              itemDescription="An impenetrable shield made from dragon scales"
              price="0.0015"
              imageUrl="/items/shield.png"
            />
            <PurchaseCard
              itemId="armor-001"
              itemName="Mythic Armor"
              itemDescription="Enchanted armor that provides ultimate protection"
              price="0.002"
              imageUrl="/items/armor.png"
            />
          </div>
        ) : (
          <div className="text-center text-gray-300 py-20">
            <p className="text-xl">Connect your wallet to start shopping!</p>
          </div>
        )}
      </main>

      <footer className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400">
          <p>Powered by Avail Nexus • Lighthouse Storage • Base Sepolia</p>
        </div>
      </footer>
    </div>
  );
}
