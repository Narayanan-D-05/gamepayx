# Game Assets

Place your encrypted game assets here (images, 3D models, videos, etc.)

## Example Assets

This folder should contain:
- `sword-001.png` - Legendary Sword image
- `shield-001.png` - Dragon Shield image
- `armor-001.png` - Mythic Armor image

## Upload to Lighthouse

```bash
# Upload an asset
node scripts/lighthouse-upload.js upload ./assets/sword-001.png sword-001

# Apply access control (only purchasers can decrypt)
node scripts/lighthouse-upload.js protect <CID> 0x5b52b0af04ce693233169a29a185d0b4a7a88907 11155111
```

## Supported File Types

- Images: PNG, JPG, GIF, SVG
- 3D Models: GLB, GLTF, FBX, OBJ
- Videos: MP4, WEBM
- Audio: MP3, WAV, OGG

## Asset Naming Convention

Use the format: `{itemId}.{extension}`
- `sword-001.png`
- `shield-001.glb`
- `armor-001.jpg`
