import inventoryMapping from '@/public/inventory-cids.json';

export interface InventoryAttribute {
  trait_type: string;
  value: string | number;
}

export interface InventoryStats {
  attack: number;
  defense: number;
  durability: number;
  weight: number;
}

export interface InventoryUnlockables {
  special_move: string;
  combo_attacks: string[];
  skin_variants: string[];
}

export interface InventoryMetadata {
  itemId: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  attributes: InventoryAttribute[];
  stats: InventoryStats;
  lore: string;
  unlockables: InventoryUnlockables;
}

/**
 * Fetch inventory metadata from Lighthouse
 */
export async function getInventoryMetadata(itemId: string): Promise<InventoryMetadata | null> {
  try {
    const mapping = inventoryMapping as Record<string, { cid: string; url: string; name: string }>;
    
    if (!mapping[itemId]) {
      console.error(`Item ${itemId} not found in Lighthouse mapping`);
      return null;
    }

    const { url } = mapping[itemId];
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    
    const metadata: InventoryMetadata = await response.json();
    return metadata;
  } catch (error) {
    console.error(`Error fetching inventory for ${itemId}:`, error);
    return null;
  }
}

/**
 * Fetch multiple inventory items
 */
export async function getBatchInventoryMetadata(itemIds: string[]): Promise<Record<string, InventoryMetadata>> {
  const results: Record<string, InventoryMetadata> = {};
  
  await Promise.all(
    itemIds.map(async (itemId) => {
      const metadata = await getInventoryMetadata(itemId);
      if (metadata) {
        results[itemId] = metadata;
      }
    })
  );
  
  return results;
}

/**
 * Get item rarity color
 */
export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    'Common': 'text-gray-400',
    'Uncommon': 'text-green-400',
    'Rare': 'text-blue-400',
    'Epic': 'text-purple-400',
    'Legendary': 'text-orange-400',
    'Mythic': 'text-pink-400'
  };
  
  return colors[rarity] || 'text-gray-400';
}

/**
 * Get item rarity gradient
 */
export function getRarityGradient(rarity: string): string {
  const gradients: Record<string, string> = {
    'Common': 'from-gray-600 to-gray-700',
    'Uncommon': 'from-green-600 to-emerald-700',
    'Rare': 'from-blue-600 to-cyan-700',
    'Epic': 'from-purple-600 to-violet-700',
    'Legendary': 'from-orange-600 to-yellow-700',
    'Mythic': 'from-pink-600 to-rose-700'
  };
  
  return gradients[rarity] || 'from-gray-600 to-gray-700';
}

/**
 * Format item stats for display
 */
export function formatStats(stats: InventoryStats): Array<{ label: string; value: number; icon: string }> {
  return [
    { label: 'Attack', value: stats.attack, icon: '⚔️' },
    { label: 'Defense', value: stats.defense, icon: '🛡️' },
    { label: 'Durability', value: stats.durability, icon: '💪' },
    { label: 'Weight', value: stats.weight, icon: '⚖️' }
  ];
}

/**
 * Check if Lighthouse data is available
 */
export function hasLighthouseData(): boolean {
  try {
    const mapping = inventoryMapping as Record<string, unknown>;
    return Object.keys(mapping).length > 0;
  } catch {
    return false;
  }
}
