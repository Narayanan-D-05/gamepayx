"use client";

import { useState } from "react";
import Image from "next/image";
import { getItemImage } from "@/lib/item-images";

interface ItemImageProps {
  itemId: string;
  itemName: string;
  icon: string;
  className?: string;
  imageUrl?: string;
}

/**
 * Smart item image component that handles:
 * - Custom uploaded images from /public/items/
 * - Lighthouse IPFS images
 * - Emoji fallback if no image
 */
export function ItemImage({ itemId, itemName, icon, className = "", imageUrl }: ItemImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Determine image source priority:
  // 1. Explicit imageUrl prop (from Lighthouse)
  // 2. Local /public/items/ folder
  // 3. Fallback to emoji icon
  
  const getImagePath = () => {
    if (imageUrl) return imageUrl;
    
    // Try to get image from mapping
    return getItemImage(itemId);
  };

  const imagePath = getImagePath();
  const shouldShowImage = !imageError && imagePath;

  if (!shouldShowImage || imageError) {
    // Fallback to emoji
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="text-7xl">{icon}</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5 animate-pulse">
          <span className="text-4xl">{icon}</span>
        </div>
      )}
      <Image
        src={imagePath}
        alt={itemName}
        fill
        className="object-cover"
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
        priority={false}
      />
    </div>
  );
}
