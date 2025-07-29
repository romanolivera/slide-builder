# Slide Builder

A Next.js application for creating professional slides from Markdown content. Perfect for creating presentation slides with custom backgrounds and content images.

## Features

- **Markdown Input**: Write slide content using simple Markdown syntax
- **Auto-Parsing**: Automatically converts Markdown to structured slide data
- **Custom Images**: Support for custom background and content images
- **Download**: Export individual slides as high-quality PNG images
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

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

## Usage

### Writing Slide Content

Use the Markdown input area to create your slides. Each slide should be separated by `---`.

**Example:**
```markdown
# Slide 1
## ¿Por qué el Barkley Marathons no da medallas?
La carrera más brutal del mundo... sin premio.
---
# Slide 2
## ¿Qué es el Barkley?
- Un ultramaratón de 5 vueltas (~32 km c/u) en Tennessee.
- Tiempo límite: 60 horas.
- Sin ruta marcada. Solo con mapa, brújula… y paciencia.
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

### Adding Custom Images

#### Background Images
- `bg1.png` - Used for the first slide
- `bg2.png` - Used for middle slides
- `bg3.png` - Used for the last slide

#### Content Images
You can add content images in two ways:

**Method 1: Interactive Upload (Recommended)**
1. Click on the image area below each slide preview
2. Select any image file (JPG, PNG, WebP, GIF, etc.)
3. The image will be automatically converted to PNG and resized
4. Images are automatically named `slide{N}.png` where N is the slide number
5. Hover over uploaded images to see a red X button for removal

**Method 2: Manual File Placement**
Place your content images in the `public/` folder with the following naming convention:

- `slide1.png` - Content image for slide 1
- `slide2.png` - Content image for slide 2
- `slide3.png` - Content image for slide 3
- `slide4.png` - Content image for slide 4
- `slide5.png` - Content image for slide 5
- etc.

**Image Requirements:**
- Format: Any image format (automatically converted to PNG)
- Recommended size: 600x400 pixels or similar aspect ratio
- The image will be automatically scaled and cropped to fit

### Downloading Slides

Click the "Download Slide X" button below each slide to export it as a high-quality PNG image.

## Project Structure

```
slide-builder/
├── app/
│   ├── page.tsx          # Main application page
│   └── layout.tsx        # Root layout
├── components/
│   ├── slide.tsx         # Slide component with image integration
│   └── ui/               # UI components
├── public/
│   ├── bg1.png          # Background for first slide
│   ├── bg2.png          # Background for middle slides
│   ├── bg3.png          # Background for last slide
│   ├── slide1.png       # Content image for slide 1
│   ├── slide2.png       # Content image for slide 2
│   └── input.md         # Default slide content
└── README.md
```

## Customization

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

## Development

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. 