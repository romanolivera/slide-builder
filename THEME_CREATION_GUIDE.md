# Theme Creation Guide

This guide explains how to create new themes for your slide builder. Themes are created manually (not via the UI) and stored in the `public/themes/` folder structure.

## Folder Structure

```
public/
├── themes/
│   ├── default/                    # Default theme
│   │   ├── bg1.png               # First slide background
│   │   ├── bg2.png               # Middle slides background  
│   │   ├── bg3.png               # Last slide background
│   │   └── config.json           # Theme configuration
│   │
│   ├── modern/                    # Modern theme example
│   │   ├── bg1.png
│   │   ├── bg2.png
│   │   ├── bg3.png
│   │   └── config.json
│   │
│   └── your-theme-name/           # Your new theme
│       ├── bg1.png
│       ├── bg2.png
│       ├── bg3.png
│       └── config.json
```

## Step-by-Step Theme Creation

### 1. Create Theme Folder
```bash
mkdir -p public/themes/your-theme-name
```

### 2. Add Background Images
Place your 3 background images in the folder:
- `bg1.png` - First slide background (1080x1350px recommended)
- `bg2.png` - Middle slides background (1080x1350px recommended)
- `bg3.png` - Last slide background (1080x1350px recommended)

### 3. Create config.json
Create a `config.json` file in your theme folder:

```json
{
  "id": "your-theme-name",
  "name": "Your Theme Display Name",
  "textColor": "#FFFFFF",
  "backgrounds": {
    "first": "/themes/your-theme-name/bg1.png",
    "middle": "/themes/your-theme-name/bg2.png",
    "last": "/themes/your-theme-name/bg3.png"
  },
  "fonts": {
    "title": "Montserrat",
    "subtitle": "Open Sans",
    "body": "Open Sans"
  },
  "layout": {
    "titleSize": 96,
    "subtitleSize": 36,
    "bodySize": 28,
    "titleSpacing": 32,
    "contentSpacing": 24,
    "imagePosition": "center"
  },
  "isBuiltIn": true,
  "createdAt": 0
}
```

### 4. Update Theme Loading (One-time)
Add your theme name to the `themeFolders` array in `lib/themes.ts`:

```typescript
const themeFolders = [
  'default',
  'modern',
  'your-theme-name'  // Add this line
]
```

## Configuration Options

### Text Colors
Use any valid CSS color:
- Hex: `#FFFFFF`, `#000000`
- RGB: `rgb(255, 255, 255)`
- Named: `white`, `black`, `red`

### Fonts
Available fonts (make sure they're loaded in your CSS):
- `League Gothic` (default)
- `Montserrat`
- `Open Sans`
- `Inter`
- `Roboto`
- `Playfair Display`

### Layout Settings
- `titleSize`: Title font size in pixels (60-200)
- `subtitleSize`: Subtitle font size in pixels (20-100)
- `bodySize`: Body text size in pixels (16-80)
- `titleSpacing`: Space below title in pixels (0-100)
- `contentSpacing`: Space between content elements in pixels (8-50)
- `imagePosition`: `"top"`, `"center"`, or `"bottom"`

## Example Themes

### Default Theme
- Text: Black (#000000)
- Fonts: League Gothic (title), Inter (body)
- Layout: Large title (116px), bottom image position

### Modern Theme
- Text: White (#FFFFFF)
- Fonts: Montserrat (title), Open Sans (body)
- Layout: Medium title (96px), center image position

## Testing Your Theme

1. Create the theme folder and files
2. Update the `themeFolders` array in `lib/themes.ts`
3. Restart your development server
4. Open the app and go to Settings → Theme
5. Your new theme should appear in the theme selector

## Troubleshooting

- **Theme not showing**: Check that the theme name is added to `themeFolders`
- **Images not loading**: Verify image paths in `config.json`
- **Fonts not working**: Ensure fonts are loaded in your CSS
- **Build errors**: Check JSON syntax in `config.json`

## Best Practices

1. **Use descriptive names**: `corporate`, `minimalist`, `playful`
2. **Consistent sizing**: Keep title sizes between 80-120px for readability
3. **Contrast**: Ensure text color contrasts well with background
4. **Test thoroughly**: Check how your theme looks with different content lengths
5. **Version control**: Commit theme changes to your repository

## Adding New Themes

To add a new theme:
1. Follow the steps above
2. Add the theme name to `themeFolders` in `lib/themes.ts`
3. Restart the dev server
4. Your theme will automatically appear in the UI

No code changes needed for new themes - just create folders and config files!
