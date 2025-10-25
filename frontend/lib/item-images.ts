/**
 * Item Image Mapping
 * Maps item IDs to actual image filenames in public/images/
 */

export const ITEM_IMAGE_MAP: Record<string, string> = {
  // Swords (7 items)
  "sword-001": "black katana.jpeg",
  "sword-002": "dark sword.jpg",
  "sword-003": "rune blade.jpg",
  "sword-004": "dragon dragger.jpg",
  "sword-005": "artis sword.jpeg",
  "sword-006": "cosmic sword.jpeg",
  "sword-007": "ether sword.jpeg",
  
  // Ranged Weapons (3 items)
  "weapon-001": "dark bow.jpg",
  "weapon-002": "dragon shot.jpg",
  "weapon-003": "magic pistol.jpg",
  
  // Claws (2 items)
  "claw-001": "rune claw.jpg",
  "claw-002": "steel claw.jpg",
  
  // Special Weapons (2 items)
  "reaper-001": "blood reaper.jpg",
  "twin-001": "heavenly twin sword.jpeg",
};

/**
 * Get image path for an item
 */
export function getItemImage(itemId: string): string | null {
  const filename = ITEM_IMAGE_MAP[itemId];
  if (!filename) return null;
  return `/images/${filename}`;
}

/**
 * Get all available items
 */
export function getAvailableItems() {
  return Object.keys(ITEM_IMAGE_MAP);
}

/**
 * Check if item has an image
 */
export function hasItemImage(itemId: string): boolean {
  return itemId in ITEM_IMAGE_MAP;
}
