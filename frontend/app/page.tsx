"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { PurchaseCard } from "@/components/PurchaseCard";
import { CrossChainPurchaseCard } from "@/components/CrossChainPurchaseCard";
import { CrossChainInventory } from "@/components/CrossChainInventory";

type Tab = "shop" | "crosschain" | "inventory";

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  
  const [activeTab, setActiveTab] = useState<Tab>("crosschain");

  const switchToSepolia = () => {
    if (switchChain) {
      switchChain({ chainId: 11155111 });
    }
  };

  const switchToBase = () => {
    if (switchChain) {
      switchChain({ chainId: 84532 });
    }
  };

  const getChainBadge = () => {
    if (!chain) return null;
    
    if (chain.id === 11155111) {
      return (
        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30 flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Sepolia
        </span>
      );
    }
    
    if (chain.id === 84532) {
      return (
        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30 flex items-center gap-1">
          <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
          Base Sepolia
        </span>
      );
    }

    return (
      <span className="px-3 py-1 bg-gray-500/20 text-gray-300 text-sm rounded-full border border-gray-500/30">
        {chain.name}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-black/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">🎮 PayX</h1>
              <span className="px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">
                v2.0 Cross-Chain
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              {isConnected && (
                <>
                  {getChainBadge()}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={switchToSepolia}
                      disabled={chain?.id === 11155111}
                      className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs rounded transition-colors disabled:opacity-50"
                      title="Switch to Sepolia"
                    >
                      Sepolia
                    </button>
                    <button
                      onClick={switchToBase}
                      disabled={chain?.id === 84532}
                      className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs rounded transition-colors disabled:opacity-50"
                      title="Switch to Base"
                    >
                      Base
                    </button>
                  </div>

                  <span className="text-sm text-gray-300 font-mono">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                  <button
                    onClick={() => disconnect()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
                  >
                    Disconnect
                  </button>
                </>
              )}
              
              {!isConnected && (
                <button
                  onClick={() => connectors[0] && connect({ connector: connectors[0] })}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all font-semibold shadow-lg"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Cross-Chain Game Store
          </h2>
          <p className="text-xl text-gray-300 mb-4">
            Purchase once, own everywhere with Avail Nexus
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <span className="text-blue-400">⚡</span> Instant Verification
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="text-purple-400">🌐</span> Multi-Chain Support
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="text-pink-400">🔐</span> Lighthouse Storage
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white/5 backdrop-blur-md rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setActiveTab("crosschain")}
              className={`px-6 py-2 rounded-md transition-all font-semibold ${
                activeTab === "crosschain"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🌐</span>
                Cross-Chain Store
              </span>
            </button>
            <button
              onClick={() => setActiveTab("shop")}
              className={`px-6 py-2 rounded-md transition-all font-semibold ${
                activeTab === "shop"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🛒</span>
                Regular Store
              </span>
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`px-6 py-2 rounded-md transition-all font-semibold ${
                activeTab === "inventory"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>📦</span>
                My Inventory
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <main>
          {!isConnected ? (
            <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
              <div className="text-6xl mb-6">🔐</div>
              <p className="text-xl text-white mb-4">Connect Your Wallet</p>
              <p className="text-gray-400 mb-6">Start shopping cross-chain with Avail Nexus</p>
              <button
                onClick={() => connectors[0] && connect({ connector: connectors[0] })}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all font-semibold shadow-lg"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <>
              {/* Cross-Chain Store */}
              {activeTab === "crosschain" && (
                <div>
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🌐</span>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">Cross-Chain Marketplace</h3>
                        <p className="text-gray-300 text-sm">
                          Items purchased here are accessible on <strong>all chains</strong> via Avail verification.
                          Buy on Sepolia, use on Base!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Swords */}
                    <CrossChainPurchaseCard
                      itemId="sword-001"
                      itemName="Black Katana"
                      itemDescription="A legendary katana forged in darkness. Full details on Lighthouse!"
                      price="0.001"
                      icon="⚔️"
                    />
                    <CrossChainPurchaseCard
                      itemId="sword-002"
                      itemName="Dark Sword"
                      itemDescription="A blade shrouded in shadow energy. Full details on Lighthouse!"
                      price="0.0012"
                      icon="⚔️"
                    />
                    <CrossChainPurchaseCard
                      itemId="sword-003"
                      itemName="Rune Blade"
                      itemDescription="Ancient sword inscribed with powerful runes. Full details on Lighthouse!"
                      price="0.003"
                      icon="✨"
                    />
                    <CrossChainPurchaseCard
                      itemId="sword-004"
                      itemName="Dragon Dragger"
                      itemDescription="A mystical dagger infused with dragon essence. Full details on Lighthouse!"
                      price="0.0015"
                      icon="🐉"
                    />
                    <CrossChainPurchaseCard
                      itemId="sword-005"
                      itemName="Artis Sword"
                      itemDescription="Masterfully crafted blade by legendary artisan. Full details on Lighthouse!"
                      price="0.0018"
                      icon="⚔️"
                    />
                    <CrossChainPurchaseCard
                      itemId="sword-006"
                      itemName="Cosmic Sword"
                      itemDescription="Blade forged from cosmic energy and stardust. Full details on Lighthouse!"
                      price="0.0025"
                      icon="🌟"
                    />
                    <CrossChainPurchaseCard
                      itemId="sword-007"
                      itemName="Ether Sword"
                      itemDescription="Ethereal blade that phases through dimensions. Full details on Lighthouse!"
                      price="0.0022"
                      icon="✨"
                    />
                    
                    {/* Ranged Weapons */}
                    <CrossChainPurchaseCard
                      itemId="weapon-001"
                      itemName="Dark Bow"
                      itemDescription="A mystical bow that never misses its target. Full details on Lighthouse!"
                      price="0.002"
                      icon="🏹"
                    />
                    <CrossChainPurchaseCard
                      itemId="weapon-002"
                      itemName="Dragon Shot"
                      itemDescription="Dragon-powered rifle with explosive rounds. Full details on Lighthouse!"
                      price="0.0022"
                      icon="🔫"
                    />
                    <CrossChainPurchaseCard
                      itemId="weapon-003"
                      itemName="Magic Pistol"
                      itemDescription="Enchanted pistol that fires arcane bullets. Full details on Lighthouse!"
                      price="0.0018"
                      icon="🪄"
                    />
                    
                    {/* Claws */}
                    <CrossChainPurchaseCard
                      itemId="claw-001"
                      itemName="Rune Claw"
                      itemDescription="Razor-sharp claws etched with ancient runes. Full details on Lighthouse!"
                      price="0.0016"
                      icon="🦅"
                    />
                    <CrossChainPurchaseCard
                      itemId="claw-002"
                      itemName="Steel Claw"
                      itemDescription="Heavy-duty steel claws for brutal combat. Full details on Lighthouse!"
                      price="0.0014"
                      icon="🦾"
                    />
                    
                    {/* Special Weapon */}
                    <CrossChainPurchaseCard
                      itemId="reaper-001"
                      itemName="Blood Reaper"
                      itemDescription="A cursed scythe that drains life force. Full details on Lighthouse!"
                      price="0.0025"
                      icon="💀"
                    />
                    
                    {/* Heavenly Twin Sword */}
                    <CrossChainPurchaseCard
                      itemId="twin-001"
                      itemName="Heavenly Twin Sword"
                      itemDescription="Dual blades blessed by celestial beings. Full details on Lighthouse!"
                      price="0.0035"
                      icon="⚔️"
                    />
                  </div>
                </div>
              )}

              {/* Regular Store */}
              {activeTab === "shop" && (
                <div>
                  <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🛒</span>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">Regular Marketplace</h3>
                        <p className="text-gray-300 text-sm">
                          Traditional single-chain purchases. Items are only available on the chain you purchase them on.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Swords */}
                    <PurchaseCard
                      itemId="sword-001"
                      itemName="Black Katana"
                      itemDescription="A legendary katana forged in darkness."
                      price="0.001"
                    />
                    <PurchaseCard
                      itemId="sword-002"
                      itemName="Dark Sword"
                      itemDescription="A blade shrouded in shadow energy."
                      price="0.0012"
                    />
                    <PurchaseCard
                      itemId="sword-003"
                      itemName="Rune Blade"
                      itemDescription="Ancient sword inscribed with powerful runes."
                      price="0.003"
                    />
                    <PurchaseCard
                      itemId="sword-004"
                      itemName="Dragon Dragger"
                      itemDescription="A mystical dagger infused with dragon essence."
                      price="0.0015"
                    />
                    <PurchaseCard
                      itemId="sword-005"
                      itemName="Artis Sword"
                      itemDescription="Masterfully crafted blade by legendary artisan."
                      price="0.0018"
                    />
                    <PurchaseCard
                      itemId="sword-006"
                      itemName="Cosmic Sword"
                      itemDescription="Blade forged from cosmic energy and stardust."
                      price="0.0025"
                    />
                    <PurchaseCard
                      itemId="sword-007"
                      itemName="Ether Sword"
                      itemDescription="Ethereal blade that phases through dimensions."
                      price="0.0022"
                    />
                    
                    {/* Ranged Weapons */}
                    <PurchaseCard
                      itemId="weapon-001"
                      itemName="Dark Bow"
                      itemDescription="A mystical bow that never misses its target."
                      price="0.002"
                    />
                    <PurchaseCard
                      itemId="weapon-002"
                      itemName="Dragon Shot"
                      itemDescription="Dragon-powered rifle with explosive rounds."
                      price="0.0022"
                    />
                    <PurchaseCard
                      itemId="weapon-003"
                      itemName="Magic Pistol"
                      itemDescription="Enchanted pistol that fires arcane bullets."
                      price="0.0018"
                    />
                    
                    {/* Claws */}
                    <PurchaseCard
                      itemId="claw-001"
                      itemName="Rune Claw"
                      itemDescription="Razor-sharp claws etched with ancient runes."
                      price="0.0016"
                    />
                    <PurchaseCard
                      itemId="claw-002"
                      itemName="Steel Claw"
                      itemDescription="Heavy-duty steel claws for brutal combat."
                      price="0.0014"
                    />
                    
                    {/* Special Weapons */}
                    <PurchaseCard
                      itemId="reaper-001"
                      itemName="Blood Reaper"
                      itemDescription="A cursed scythe that drains life force."
                      price="0.0025"
                    />
                    <PurchaseCard
                      itemId="twin-001"
                      itemName="Heavenly Twin Sword"
                      itemDescription="Dual blades blessed by celestial beings."
                      price="0.0035"
                    />
                  </div>
                </div>
              )}

              {/* Inventory */}
              {activeTab === "inventory" && (
                <CrossChainInventory />
              )}
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h4 className="text-white font-bold mb-3">🌐 Powered By</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>• Avail Nexus (Cross-Chain)</li>
                <li>• Lighthouse (Storage)</li>
                <li>• Hardhat 3 (Development)</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">⛓️ Networks</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>• Ethereum Sepolia</li>
                <li>• Base Sepolia</li>
                <li>• Avail Turing (Coming Soon)</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">📚 Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="https://docs.availproject.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Avail Docs →
                  </a>
                </li>
                <li>
                  <a href="https://github.com/Sanjaylicet/Payx" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    GitHub Repo →
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm pt-6 border-t border-white/10">
            <p>© 2025 PayX • Cross-Chain Game Store • Built with ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
