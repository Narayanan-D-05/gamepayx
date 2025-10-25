# 🎮 Game Item Images

Place your item images here.

## 📁 **Required Images:**

### **Item Images:**
- `sword.png` or `sword.jpg` - Legendary Sword image
- `shield.png` or `shield.jpg` - Dragon Shield image
- `armor.png` or `armor.jpg` - Mythic Armor image

### **Recommended Specs:**
- **Format:** PNG (with transparency) or JPG
- **Size:** 400x400px or 512x512px (square)
- **Quality:** High resolution for sharp display
- **File Size:** < 500KB per image (optimized)

---

## 🎨 **How to Use:**

### **After adding images:**

1. Save your images here with these names:
   ```
   frontend/public/items/
   ├── sword.png
   ├── shield.png
   └── armor.png
   ```

2. They'll automatically be used in:
   - Purchase cards (Cross-Chain Store)
   - Inventory items
   - Detail modals

3. Access in code:
   ```tsx
   <Image src="/items/sword.png" alt="Legendary Sword" />
   ```

---

## 🔄 **Fallback:**

If no image is provided, the component will show:
- Emoji icons (⚔️ 🛡️ 🦾)
- Gradient backgrounds
- Item name placeholder

---

## 💡 **Tips:**

### **For Best Results:**
- Use transparent PNGs for items without background
- Keep consistent aspect ratios (square)
- Optimize images before uploading (use TinyPNG, ImageOptim)
- Use descriptive filenames matching item IDs

### **Example Names:**
```
sword-001.png    → Legendary Sword
shield-002.png   → Dragon Shield
armor-003.png    → Mythic Armor
potion-004.png   → Health Potion (future)
```

---

## 🌐 **Remote Images (Optional):**

You can also use Lighthouse IPFS for images:

1. Upload image to Lighthouse
2. Get CID
3. Update `inventory-cids.json`:
   ```json
   {
     "sword-001": {
       "image": "https://gateway.lighthouse.storage/ipfs/QmYourImageCID"
     }
   }
   ```

---

**Ready to add your images!** Just drop them in this folder. 🎨
