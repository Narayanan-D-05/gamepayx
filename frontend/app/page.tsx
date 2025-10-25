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
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-50 bg-black/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <h1 className="text-3xl font-bold text-white tracking-tight">GamepayX</h1>
              
              {/* Navigation Pills */}
              <div className="hidden md:flex gap-2">
                <button
                  onClick={() => setActiveTab("crosschain")}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === "crosschain"
                      ? "bg-white text-black"
                      : "bg-transparent text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Cross-Chain Store
                </button>
                <button
                  onClick={() => setActiveTab("shop")}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === "shop"
                      ? "bg-white text-black"
                      : "bg-transparent text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Regular Store
                </button>
                <button
                  onClick={() => setActiveTab("inventory")}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === "inventory"
                      ? "bg-white text-black"
                      : "bg-transparent text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Inventory
                </button>
              </div>
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
                  className="px-6 py-2 bg-white hover:bg-gray-100 text-black rounded-lg transition-all font-semibold shadow-lg"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-7xl font-bold text-white mb-6 tracking-tight">
            GamepayX
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Own your items. Play anywhere. Trade everywhere.
          </p>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-center mb-8">
          <div className="inline-flex bg-black/40 backdrop-blur-lg rounded-lg p-1 border border-white/20">
            <button
              onClick={() => setActiveTab("crosschain")}
              className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${
                activeTab === "crosschain" ? "bg-white text-black" : "text-gray-400"
              }`}
            >
              Cross-Chain
            </button>
            <button
              onClick={() => setActiveTab("shop")}
              className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${
                activeTab === "shop" ? "bg-white text-black" : "text-gray-400"
              }`}
            >
              Store
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${
                activeTab === "inventory" ? "bg-white text-black" : "text-gray-400"
              }`}
            >
              Inventory
            </button>
          </div>
        </div>

        {/* Content */}
        <main>
          {!isConnected ? (
            <div className="text-center py-20 bg-black/40 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl">
              <div className="text-6xl mb-6">🔐</div>
              <p className="text-xl text-white mb-4 text-shadow">Connect Your Wallet</p>
              <p className="text-gray-300 mb-6 text-shadow">Start shopping cross-chain with Avail Nexus</p>
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
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-lg border border-blue-500/30 shadow-xl">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🌐</span>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1 text-shadow">Cross-Chain Marketplace</h3>
                        <p className="text-gray-100 text-sm text-shadow">
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
                  <div className="mb-6 p-4 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 shadow-xl">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">🛒</span>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1 text-shadow">Regular Marketplace</h3>
                        <p className="text-gray-100 text-sm text-shadow">
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
      <footer className="border-t border-white/20 mt-20 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <h4 className="text-white font-bold mb-3 text-shadow">🌐 Powered By</h4>
              <ul className="space-y-2 text-gray-300 text-sm text-shadow">
                <li>• Avail Nexus (Cross-Chain)</li>
                <li>• Lighthouse (Storage)</li>
                <li>• Hardhat 3 (Development)</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 text-shadow">⛓️ Networks</h4>
              <ul className="space-y-2 text-gray-300 text-sm text-shadow">
                <li>• Ethereum Sepolia</li>
                <li>• Base Sepolia</li>
                <li>• Avail Turing (Coming Soon)</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 text-shadow">📚 Resources</h4>
              <ul className="space-y-2 text-gray-300 text-sm text-shadow">
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
          <div className="text-center text-gray-300 text-sm pt-6 border-t border-white/20">
            <p className="text-shadow">© 2025 GamepayX • Cross-Chain Game Store • Built with ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
