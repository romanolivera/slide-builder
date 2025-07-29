# Slide Builder

A Next.js application for creating professional slides from Markdown content. Perfect for creating presentation slides with custom backgrounds, content images, and themes. Features comprehensive step-by-step instructions and full bilingual support (Spanish/English).

## ✨ Features

- **📝 Markdown Input**: Write slide content using simple Markdown syntax
- **🔄 Auto-Parsing**: Automatically converts Markdown to structured slide data
- **🖼️ Interactive Image Upload**: Click to add images to each slide with automatic conversion
- **🎨 Theme Management**: Create and save custom themes with backgrounds and text colors
- **🌍 Bilingual Support**: Full Spanish and English interface with easy language switching
- **📋 Step-by-Step Instructions**: Comprehensive guide accessible via the instructions button
- **⬇️ Download**: Export individual slides or all slides as high-quality PNG images
- **📱 Responsive Design**: Works on desktop and mobile devices
- **⚙️ Settings Panel**: Easy access to theme management and customization

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd slide-builder
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 How to Use

### Quick Start Guide

1. **📋 Read Instructions**: Click the "Instrucciones" (Spanish) or "Instructions" (English) button in the top-right corner for a complete step-by-step guide.

2. **🌍 Choose Language**: Use the language switcher (globe icon) to toggle between Spanish and English.

3. **📝 Write Content**: Use the Markdown input area on the left to write your slide content.

4. **🖼️ Add Images**: Click on the image area below each slide to upload content images.

5. **🎨 Customize Theme**: Click the "Settings" button to create custom themes with backgrounds and text colors.

6. **⬇️ Download**: Use the download buttons to export your slides.

### Writing Slide Content

Use the Markdown input area to create your slides. Each slide should be separated by `---`.

**Example:**
```markdown
## Si tu ego es frágil... no veas este carrusel
Estos datos duelen más que ver tus fotos de hace 10 años.

---

## El rey de la Zona 2 ⚡
- Watts en Zona 2 de un mortal promedio: 140-200w
- Pogačar: **340w y lo puede mantener por 5 horas**
¿Cuánto tiempo puedes mantener 340W?

---

## Tu corazón vs el de Pogačar
- El promedio de la población tiene un pulso en reposo de entre 60 y 80 ppm
- Tadej Pogačar promedia 42 ppm
- Su pulso más bajo: **37 ppm**
**¿Cuánto es tu pulso en reposo?**
```

### Slide Structure

Each slide can contain:
- **Title**: Use `##` for the main title
- **Subtitle**: Any text after the title (optional)
- **Bullets**: Use `-` for bullet points
- **Quotes**: Use `>` for highlighted quotes
- **Callout**: Any additional text (appears at bottom)

### Slide Template

Here's the complete template for structuring each slide:

```markdown
## Slide Title Here
Subtitle or main question (optional)

- Bullet point 1
- Bullet point 2
- Bullet point 3

> Quote or highlighted text 1
> Quote or highlighted text 2

Callout or final statement (optional)
---
```

### Detailed Breakdown:

#### 1. **Title** (Required)
- Start with `## ` (two hash symbols + space)
- This becomes the main title of the slide
- Example: `## ¿120g de carbos por hora? 🍝`

#### 2. **Subtitle** (Optional)
- First line after title that doesn't start with `## `, `- `, or `> `
- Usually a question or introductory text
- Example: `¿Crees que comes mucho entrenando?`

#### 3. **Bullet Points** (Optional)
- Lines starting with `- ` (dash + space)
- Will be rendered as a bulleted list
- Example:
  ```
  - Bebida deportiva promedio: 20–30g/h
  - Pogačar: **120g/h**
  ```

#### 4. **Quotes** (Optional)
- Lines starting with `> ` (greater than + space)
- Will be rendered as italicized, centered quotes
- Example:
  ```
  > **¿Tú cuántos comes?**
  > ¡Como 4 plátanos cada hora!
  ```

#### 5. **Callout** (Optional)
- The **last** line that doesn't start with `## `, `- `, or `> `
- Usually a final statement or conclusion
- Example: `Su estómago procesa más azúcar que tú en una semana.`

#### 6. **Slide Separator**
- Use `---` (three dashes) to separate slides

### Complete Example:

```markdown
## ¿120g de carbos por hora? 🍝
¿Crees que comes mucho entrenando?

- Bebida deportiva promedio: 20–30g/h
- Pogačar: **120g/h**

> **¿Tú cuántos comes?**
> ¡Como 4 plátanos cada hora!

Su estómago procesa más azúcar que tú en una semana.
---
## Next Slide Title
Next slide content here...
```

### Important Notes:

- **Order matters**: The parsing logic looks for specific patterns in order
- **Subtitle**: Only the **first** non-title, non-bullet, non-quote line becomes the subtitle
- **Callout**: Only the **last** non-title, non-bullet, non-quote line becomes the callout
- **Quotes**: All lines starting with `> ` are captured as quotes
- **Bullets**: All lines starting with `- ` are captured as bullets
- **Any other lines**: Will be ignored unless they're the first or last eligible line

## 🖼️ Adding Images

### Content Images (Interactive Upload)

1. **Click the Image Area**: Below each slide preview, click on the dashed border area
2. **Select Image**: Choose any image file (JPG, PNG, WebP, GIF, etc.)
3. **Automatic Processing**: The image is automatically:
   - Converted to PNG format
   - Resized to 600x400 pixels
   - Named `slide{N}.png` where N is the slide number
4. **Remove Images**: Hover over uploaded images to see a red X button for removal
5. **Temporary Storage**: Images are temporary and will be reset when you reload the page

### Background Images (Theme Management)

1. **Access Settings**: Click the "Settings" button in the top-right corner
2. **Create Theme**: Click "Create New Theme" to set up custom backgrounds
3. **Upload Backgrounds**: Upload three different background images:
   - **First Slide Background**: Used for the first slide
   - **Middle Slides Background**: Used for intermediate slides
   - **Last Slide Background**: Used for the final slide
4. **Save Theme**: Give your theme a name and save it for future use

## 🎨 Theme Management

### Creating Custom Themes

1. **Open Settings**: Click the "Settings" button (⚙️) in the top-right corner
2. **Create New Theme**: Click "Create New Theme" in the Theme Management section
3. **Configure Theme**:
   - **Theme Name**: Give your theme a descriptive name
   - **Text Color**: Choose the color for all text on slides
   - **Background Images**: Upload three different background images
4. **Save Theme**: Click "Create Theme" to save your custom theme

### Managing Themes

- **Select Theme**: Use the "Current Theme" dropdown to switch between themes
- **Delete Themes**: Custom themes can be deleted using the trash icon
- **Default Theme**: A basic theme is always available as fallback

### Theme Features

- **Persistent Storage**: Themes are saved in your browser's localStorage
- **Multiple Themes**: Create as many themes as you need
- **Background Variety**: Different backgrounds for first, middle, and last slides
- **Text Color Control**: Customize text color for better readability

## 🌍 Language Support

### Switching Languages

- **Language Switcher**: Use the globe icon (🌍) in the top-right corner
- **Available Languages**: 
  - 🇪🇸 Español (Default)
  - 🇺🇸 English
- **Persistent Setting**: Your language choice is remembered across sessions

### Bilingual Features

- **Complete Interface**: All buttons, labels, and messages are translated
- **Instructions**: Step-by-step guide available in both languages
- **Error Messages**: All error messages and notifications are bilingual
- **Help Text**: All help text and tooltips are translated

## 📋 Instructions System

### Accessing Instructions

- **Instructions Button**: Click "Instrucciones" (Spanish) or "Instructions" (English) in the header
- **Comprehensive Guide**: Complete step-by-step instructions with examples
- **Visual Examples**: Code snippets and visual guides
- **Pro Tips**: Best practices and helpful hints

### Instruction Topics

1. **Writing Markdown**: How to structure your slide content
2. **Adding Images**: Interactive image upload process
3. **Theme Customization**: Creating and managing themes
4. **Downloading Slides**: How to export your presentations

## ⬇️ Downloading Slides

### Individual Slides
- Click "Download Slide X" below each slide
- Exports as high-quality PNG image
- Maintains 1080x1350px aspect ratio

### All Slides
- Click "Download All (X)" button in the preview section
- Downloads all slides sequentially
- Each slide saved as separate PNG file

## 🏗️ Project Structure

```
slide-builder/
├── app/
│   ├── api/
│   │   ├── upload-image/route.ts      # Content image upload API
│   │   ├── delete-image/route.ts      # Content image deletion API
│   │   └── upload-background/route.ts # Background image upload API
│   ├── page.tsx                       # Main application page
│   └── layout.tsx                     # Root layout
├── components/
│   ├── slide.tsx                      # Slide component with image integration
│   ├── image-upload.tsx               # Interactive image upload component
│   ├── settings.tsx                   # Settings dialog with theme management
│   ├── theme-editor.tsx               # Theme creation component
│   ├── theme-selector.tsx             # Theme selection component
│   ├── instructions.tsx               # Step-by-step instructions dialog
│   ├── language-switcher.tsx          # Language selection component
│   └── ui/                            # UI components
├── lib/
│   ├── themes.ts                      # Theme management utilities
│   └── translations.ts                # Bilingual text content
├── public/
│   ├── bg1.png                       # Default background for first slide
│   ├── bg2.png                       # Default background for middle slides
│   ├── bg3.png                       # Default background for last slide
│   └── input.md                      # Default slide content
└── README.md
```

## 🔧 Customization

### Modifying Slide Layout
Edit `components/slide.tsx` to change:
- Font sizes and styles
- Content positioning
- Image dimensions
- Color schemes

### Adding More Background Options
1. Add new background images to `public/`
2. Modify the background selection logic in `slide.tsx`
3. The current logic uses:
   - `bg1.png` for the first slide
   - `bg2.png` for middle slides
   - `bg3.png` for the last slide

### Extending Image Support
The `getContentImage()` function in `slide.tsx` can be extended to support:
- Different image formats
- Dynamic image selection based on content
- External image URLs

## 🛠️ Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linting

### Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - UI components
- **html-to-image** - Image generation
- **React Markdown** - Markdown rendering
- **Sharp** - Image processing
- **Lucide React** - Icons

### API Endpoints

- `POST /api/upload-image` - Upload content images
- `DELETE /api/delete-image` - Delete content images
- `POST /api/upload-background` - Upload background images

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 