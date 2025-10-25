# 🎨 **Image Mapping System - Complete Guide**

## ✅ **What Changed:**

Instead of automatic image detection, we now use a **flexible mapping system** that connects item IDs to your actual image filenames.

---

## 📁 **Your Available Images:**

```
frontend/public/images/
├── afera bundle.jpg
├── black katana.jpeg
├── blood reaper.jpg
├── dark bow.jpg
├── dark emperor bundle.jpg
├── dark sword.jpg
├── dragon dragger.jpg
├── dragon shot.jpg
├── flame emperor bundle.jpg
├── frost emperor bundle.jpg
├── lightning emperor bundle.jpg
├── magic pistol.jpg
├── rune blade.jpg
├── rune claw.jpg
├── steel claw.jpg
└── ultron bundle.jpg
```

---

## 🗺️ **Current Mapping:**

**File:** `frontend/lib/item-images.ts`

```typescript
export const ITEM_IMAGE_MAP: Record<string, string> = {
  // Swords
  "sword-001": "black katana.jpeg",    ← Black Katana
  "sword-002": "dark sword.jpg",        ← Dark Sword
  "sword-003": "rune blade.jpg",        ← Rune Blade
  
  // Shields
  "shield-001": "dragon dragger.jpg",
  "shield-002": "steel claw.jpg",
  
  // Armor/Bundles
  "armor-001": "dark emperor bundle.jpg",    ← Dark Emperor Bundle
  "armor-002": "flame emperor bundle.jpg",    ← Flame Emperor Bundle
  "armor-003": "frost emperor bundle.jpg",    ← Frost Emperor Bundle
  
  // Weapons
  "weapon-001": "dark bow.jpg",          ← Dark Bow
  "weapon-002": "dragon shot.jpg",
  "weapon-003": "magic pistol.jpg",
  
  // Claws
  "claw-001": "rune claw.jpg",
  "claw-002": "steel claw.jpg",
  
  // Special
  "reaper-001": "blood reaper.jpg",      ← Blood Reaper
  
  // Bundles
  "bundle-001": "afera bundle.jpg",
  "bundle-002": "ultron bundle.jpg",
  "bundle-003": "lightning emperor bundle.jpg",
};
```

---

## 🎮 **Items Currently in Store:**

### **Cross-Chain Store (6 Items):**
1. **sword-001** → Black Katana (0.001 ETH) ⚔️
2. **armor-001** → Dark Emperor Bundle (0.0035 ETH) 👑
3. **weapon-001** → Dark Bow (0.002 ETH) 🏹
4. **armor-002** → Flame Emperor Bundle (0.004 ETH) 🔥
5. **reaper-001** → Blood Reaper (0.0025 ETH) 💀
6. **sword-003** → Rune Blade (0.003 ETH) ✨

---

## ➕ **How to Add New Items:**

### **Option 1: Add to Existing Categories**

**Example: Add Dragon Shot as a weapon**

1. **Update mapping:**
   ```typescript
   // In frontend/lib/item-images.ts
   "weapon-002": "dragon shot.jpg",  // Add this line
   ```

2. **Add to store page:**
   ```tsx
   // In frontend/app/page.tsx
   <CrossChainPurchaseCard
     itemId="weapon-002"
     itemName="Dragon Shot"
     itemDescription="A powerful dragon-powered rifle"
     price="0.0022"
     icon="🐉"
   />
   ```

### **Option 2: Create New Category**

**Example: Add potions**

1. **Add mapping:**
   ```typescript
   // In frontend/lib/item-images.ts
   "potion-001": "health-potion.jpg",
   "potion-002": "mana-potion.jpg",
   ```

2. **Add to store:**
   ```tsx
   <CrossChainPurchaseCard
     itemId="potion-001"
     itemName="Health Potion"
     itemDescription="Restores 500 HP"
     price="0.0005"
     icon="🧪"
   />
   ```

---

## 🔄 **How to Change Item Images:**

### **Scenario: Change sword-001 from "Black Katana" to "Dark Sword"**

**Step 1: Update Mapping**
```typescript
// In frontend/lib/item-images.ts
"sword-001": "dark sword.jpg",  // Changed from "black katana.jpeg"
```

**Step 2: Update Display Name (Optional)**
```tsx
// In frontend/app/page.tsx
<CrossChainPurchaseCard
  itemId="sword-001"
  itemName="Dark Sword"  // Changed from "Black Katana"
  ...
/>
```

**Step 3: Refresh Browser**
```
http://localhost:3001
```

Images update automatically! ✨

---

## 📝 **Complete Workflow:**

### **1. Add New Image File**
```bash
# Copy your image to:
frontend/public/images/new-weapon.jpg
```

### **2. Add to Mapping**
```typescript
// frontend/lib/item-images.ts
"weapon-004": "new-weapon.jpg",
```

### **3. Add to Store**
```tsx
// frontend/app/page.tsx
<CrossChainPurchaseCard
  itemId="weapon-004"
  itemName="New Weapon"
  itemDescription="Amazing new weapon!"
  price="0.003"
  icon="⚡"
/>
```

### **4. Test**
```
Open: http://localhost:3001
Go to: Cross-Chain Store tab
See: Your new item with image! 🎉
```

---

## 🎯 **Available Unused Images:**

These images are in your folder but not yet mapped:

```
✅ Mapped (Used in store):
- black katana.jpeg
- dark emperor bundle.jpg
- dark bow.jpg
- flame emperor bundle.jpg
- blood reaper.jpg
- rune blade.jpg

❌ Not Mapped (Available to use):
- afera bundle.jpg
- dark sword.jpg
- dragon dragger.jpg
- dragon shot.jpg
- frost emperor bundle.jpg
- lightning emperor bundle.jpg
- magic pistol.jpg
- rune claw.jpg
- steel claw.jpg
- ultron bundle.jpg
```

**You can add these anytime!**

---

## 💡 **Tips:**

### **1. Keep Item IDs Consistent**
```typescript
// Good ✅
"sword-001", "sword-002", "sword-003"
"armor-001", "armor-002", "armor-003"

// Bad ❌
"legendary-sword", "sword2", "SWORD_3"
```

### **2. Match Item Names to Images**
```tsx
// If mapping uses "dark emperor bundle.jpg"
// Then use similar name in UI:
itemName="Dark Emperor Bundle"  ✅
itemName="Random Armor"         ❌ (confusing)
```

### **3. Use Descriptive Icons**
```tsx
// Match icon to item type
Swords:   ⚔️ 🗡️ ⚡
Bows:     🏹 🎯
Armor:    👑 🛡️ 🦾
Magic:    ✨ 🔮 💫
Weapons:  💀 🔥 ⚡
```

---

## 🔍 **Debugging:**

### **Issue: Image not showing**

**Check 1: Is it mapped?**
```typescript
// In frontend/lib/item-images.ts
"your-item-id": "your-image.jpg",  // Must exist!
```

**Check 2: Is filename exact?**
```bash
# File:    "black katana.jpeg"  ✅
# Mapping: "black katana.jpeg"  ✅
# NOT:     "Black Katana.jpeg"  ❌ (wrong case)
# NOT:     "black-katana.jpeg"  ❌ (wrong delimiter)
```

**Check 3: Is file in correct folder?**
```
frontend/public/images/your-image.jpg  ✅
frontend/public/your-image.jpg         ❌
```

**Check 4: Browser console**
```
F12 → Console tab
Look for: 404 errors
Fix: Correct filename in mapping
```

---

## 📊 **Current Store Layout:**

### **Cross-Chain Store (6 items):**
```
Row 1:
[Black Katana]  [Dark Emperor]  [Dark Bow]

Row 2:
[Flame Emperor] [Blood Reaper]  [Rune Blade]
```

### **Regular Store (3 items):**
```
[Item 1]  [Item 2]  [Item 3]
```

---

## 🚀 **Quick Add Template:**

```typescript
// 1. Add to mapping (frontend/lib/item-images.ts)
"category-###": "filename.jpg",

// 2. Add to store (frontend/app/page.tsx)
<CrossChainPurchaseCard
  itemId="category-###"
  itemName="Display Name"
  itemDescription="Description here"
  price="0.00X"
  icon="🎮"
/>

// 3. Done! Refresh browser
```

---

## ✨ **Example: Add All Remaining Images**

Want to use all 16 images? Here's how:

```typescript
// Update frontend/lib/item-images.ts
export const ITEM_IMAGE_MAP = {
  "sword-001": "black katana.jpeg",
  "sword-002": "dark sword.jpg",
  "sword-003": "rune blade.jpg",
  "weapon-001": "dark bow.jpg",
  "weapon-002": "dragon shot.jpg",
  "weapon-003": "magic pistol.jpg",
  "armor-001": "dark emperor bundle.jpg",
  "armor-002": "flame emperor bundle.jpg",
  "armor-003": "frost emperor bundle.jpg",
  "armor-004": "lightning emperor bundle.jpg",
  "claw-001": "rune claw.jpg",
  "claw-002": "steel claw.jpg",
  "shield-001": "dragon dragger.jpg",
  "reaper-001": "blood reaper.jpg",
  "bundle-001": "afera bundle.jpg",
  "bundle-002": "ultron bundle.jpg",
};
```

Then add them to your store page! 🎉

---

## 📱 **Test Your Changes:**

```bash
# 1. Save files
# 2. Refresh browser: http://localhost:3001
# 3. Check Cross-Chain Store tab
# 4. See your images! ✨
```

---

**Your image mapping system is fully configured and ready!** 🎨✅

All your game item images will now display correctly in the cart/store!
