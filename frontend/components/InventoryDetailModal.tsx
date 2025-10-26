"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  getInventoryMetadata,
  formatStats,
  getRarityColor,
  getRarityGradient,
  type InventoryMetadata
} from "@/lib/lighthouse-inventory";
import { getItemImage } from "@/lib/item-images";

interface InventoryDetailModalProps {
  itemId: string;
  isOpen: boolean;
  onClose: () => void;
  chainName: string;
}

export function InventoryDetailModal({ itemId, isOpen, onClose, chainName }: InventoryDetailModalProps) {
  const [metadata, setMetadata] = useState<InventoryMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Get image path from mapping
  const imagePath = getItemImage(itemId);

  useEffect(() => {
    if (isOpen && itemId) {
      setLoading(true);
      getInventoryMetadata(itemId)
        .then(setMetadata)
        .finally(() => setLoading(false));
    }
  }, [itemId, isOpen]);

  if (!isOpen) return null;

  const rarity = metadata?.attributes.find(attr => attr.trait_type === "Rarity")?.value as string || "Common";
  const element = metadata?.attributes.find(attr => attr.trait_type === "Element")?.value as string;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-gradient-to-br from-blue-900/95 via-cyan-900/95 to-teal-900/95 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin text-6xl mb-4">⚙️</div>
            <p className="text-gray-300">Loading item details from Lighthouse...</p>
          </div>
        ) : metadata ? (
          <>
            {/* Header */}
            <div className={`relative p-6 bg-gradient-to-r ${getRarityGradient(rarity)} border-b border-white/20`}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl font-bold"
              >
                ×
              </button>
              
              <div className="flex items-start gap-6">
                <div className="relative w-24 h-24 flex items-center justify-center rounded-lg overflow-hidden bg-black/20">
                  {imagePath && !imageError ? (
                    <Image
                      src={imagePath}
                      alt={metadata.name}
                      fill
                      className="object-cover"
                      onError={() => setImageError(true)}
                      priority
                    />
                  ) : (
                    <span className="text-6xl">{metadata.icon}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2">{metadata.name}</h2>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 bg-black/30 rounded-full text-sm font-semibold ${getRarityColor(rarity)}`}>
                      ⭐ {rarity}
                    </span>
                    {element && (
                      <span className="px-3 py-1 bg-black/30 rounded-full text-sm font-semibold text-blue-300">
                        🔥 {element}
                      </span>
                    )}
                    <span className="px-3 py-1 bg-black/30 rounded-full text-sm font-semibold text-green-300">
                      🌐 {chainName}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">📝 Description</h3>
                <p className="text-gray-300 leading-relaxed">{metadata.description}</p>
              </div>

              {/* Stats */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3">📊 Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  {formatStats(metadata.stats).map((stat) => (
                    <div key={stat.label} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <span>{stat.icon}</span>
                          {stat.label}
                        </span>
                        <span className="text-white font-bold">{stat.value}</span>
                      </div>
                      <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                          style={{ width: `${Math.min((stat.value / 150) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attributes */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3">✨ Attributes</h3>
                <div className="grid grid-cols-2 gap-3">
                  {metadata.attributes.map((attr, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="text-gray-400 text-xs mb-1">{attr.trait_type}</div>
                      <div className="text-white font-semibold">{attr.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lore */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">📜 Lore</h3>
                <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                  <p className="text-gray-300 italic leading-relaxed">{metadata.lore}</p>
                </div>
              </div>

              {/* Unlockables */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3">🎁 Unlockables</h3>
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="text-yellow-400 font-semibold mb-2">⚡ Special Move</div>
                    <div className="text-white text-lg">{metadata.unlockables.special_move}</div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="text-cyan-400 font-semibold mb-2">🎯 Combo Attacks</div>
                    <div className="flex flex-wrap gap-2">
                      {metadata.unlockables.combo_attacks.map((combo, index) => (
                        <span key={index} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm border border-cyan-500/30">
                          {combo}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="text-pink-400 font-semibold mb-2">🎨 Skin Variants</div>
                    <div className="flex flex-wrap gap-2">
                      {metadata.unlockables.skin_variants.map((skin, index) => (
                        <span key={index} className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm border border-pink-500/30">
                          {skin}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lighthouse Badge */}
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/20">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🔐</span>
                  <div>
                    <div className="text-green-300 font-semibold mb-1">Secured by Lighthouse</div>
                    <div className="text-gray-400 text-sm">
                      This item's metadata is stored on IPFS and token-gated. Only verified owners can access full details.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/20 bg-black/20">
              <button
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-gray-300 mb-4">Failed to load item details</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
