"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Download, DownloadCloud } from "lucide-react"
import { Slide, type SlideData, type SlideRef } from "@/components/slide"
import { ImageUpload } from "@/components/image-upload"

const defaultMarkdown = `# Slide 1
## ¿Por qué el Barkley Marathons no da medallas?
La carrera más brutal del mundo... sin premio.
---
# Slide 2
## ¿Qué es el Barkley?
- Un ultramaratón de 5 vueltas (~32 km c/u) en Tennessee.
- Tiempo límite: 60 horas.
- Sin ruta marcada. Solo con mapa, brújula… y paciencia.`

function parseMarkdownToSlides(markdown: string): SlideData[] {
  const slidesRaw = markdown.split("---").map((s) => s.trim())

  return slidesRaw
    .map((slideContent, index) => {
      const lines = slideContent.split("\n").filter((line) => line.trim() !== "")
      // Title: first '## ...' line
      const titleLine = lines.find((line) => line.startsWith("## "))
      const title = titleLine ? titleLine.replace("## ", "").trim() : `Slide ${index + 1}`
      // Subtitle: first non-title, non-bullet, non-quote line
      const subtitleLine = lines.find((line) => !line.startsWith("## ") && !line.startsWith("- ") && !line.startsWith("> "))
      // Bullets: all '- ...' lines
      const bullets = lines.filter((line) => line.startsWith("- ")).map(line => line.replace(/^- /, "").trim())
      // Quotes: all '> ...' lines
      const quotes = lines.filter((line) => line.startsWith("> ")).map(line => line.replace(/^> /, "").trim())
      // Callout: last non-bullet, non-title, non-quote line (if any), after bullets
      let callout = undefined
      const nonTitleNonBulletNonQuoteLines = lines.filter((line) => !line.startsWith("## ") && !line.startsWith("- ") && !line.startsWith("> "))
      if (nonTitleNonBulletNonQuoteLines.length > 1) {
        callout = nonTitleNonBulletNonQuoteLines[nonTitleNonBulletNonQuoteLines.length - 1]
      }
      return {
        title,
        subtitle: subtitleLine,
        bullets,
        quotes,
        callout,
        slideNumber: index + 1,
        isFirstSlide: index === 0,
        isLastSlide: false, // Will be updated after all slides are processed
      }
    })
    .filter((slide) => slide.title || (slide.bullets && slide.bullets.length > 0))
    .map((slide, index, array) => ({
      ...slide,
      isLastSlide: index === array.length - 1
    }))
}

export default function SlideBuilderPage() {
  const [markdown, setMarkdown] = useState(defaultMarkdown)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloadingAll, setIsDownloadingAll] = useState(false)
  const [slideImages, setSlideImages] = useState<Record<number, string>>({})
  const [imageTimestamps, setImageTimestamps] = useState<Record<number, number>>({})
  const slides = useMemo(() => parseMarkdownToSlides(markdown), [markdown])
  const slideRefs = useRef<(SlideRef | null)[]>([])

  useEffect(() => {
    // Try to load content from input.md file
    fetch('/input.md')
      .then(response => {
        if (response.ok) {
          return response.text()
        }
        throw new Error('Failed to load input.md')
      })
      .then(content => {
        setMarkdown(content)
      })
      .catch(error => {
        console.log('Using default content:', error)
        // Keep using default content if file doesn't exist
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const handleDownloadAll = async () => {
    setIsDownloadingAll(true)
    try {
      // Download slides sequentially to avoid browser limitations
      for (let i = 0; i < slideRefs.current.length; i++) {
        const slideRef = slideRefs.current[i]
        if (slideRef) {
          await slideRef.download()
          // Small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
    } catch (error) {
      console.error('Failed to download all slides:', error)
    } finally {
      setIsDownloadingAll(false)
    }
  }

  const handleImageUploaded = (slideNumber: number, imageUrl: string) => {
    setSlideImages(prev => ({
      ...prev,
      [slideNumber]: imageUrl
    }))
    setImageTimestamps(prev => ({
      ...prev,
      [slideNumber]: Date.now()
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Los Coaches - Slide Builder</h1>
          <p className="text-gray-600 mt-1">Create professional slides from Markdown content</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Markdown Input</h2>
              <span className="text-sm text-gray-500">{slides.length} slides</span>
            </div>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-[600px] font-mono text-sm resize-none"
              placeholder="Paste your slide content here..."
            />
            <div className="text-xs text-gray-500">
              Use "---" to separate slides. Each slide should start with "## Title" followed by content. Use "- " for bullets and "&gt; " for quotes.
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Generated Slides</h2>
              {slides.length > 0 && (
                <Button 
                  onClick={handleDownloadAll} 
                  disabled={isDownloadingAll}
                  className="flex items-center gap-2"
                >
                  <DownloadCloud size={16} />
                  {isDownloadingAll ? 'Downloading...' : `Download All (${slides.length})`}
                </Button>
              )}
            </div>
            <div className="space-y-8 max-h-[800px] overflow-y-auto pr-4">
              {slides.map((slide, index) => (
                <div key={slide.slideNumber} className="space-y-4 flex flex-col items-center">
                  <div className="w-[360px] aspect-[1080/1350] bg-white border rounded-lg shadow relative overflow-hidden flex items-center justify-center">
                    <div style={{ width: '1080px', height: '1350px', position: 'absolute', top: 0, left: 0, transform: 'scale(0.333)', transformOrigin: 'top left' }}>
                      <Slide 
                        ref={(el) => {
                          slideRefs.current[index] = el
                        }}
                        slide={slide}
                        currentImageUrl={`${slideImages[slide.slideNumber] || `/slide${slide.slideNumber}.png`}?t=${imageTimestamps[slide.slideNumber] || 0}`}
                      />
                    </div>
                  </div>
                  
                  {/* Image Upload Interface */}
                  <div className="space-y-2 w-[360px]">
                    <div className="text-sm font-medium text-gray-700">Slide {slide.slideNumber} Image</div>
                    <ImageUpload
                      slideNumber={slide.slideNumber}
                      currentImageUrl={`${slideImages[slide.slideNumber] || `/slide${slide.slideNumber}.png`}?t=${imageTimestamps[slide.slideNumber] || 0}`}
                      onImageUploaded={(imageUrl) => handleImageUploaded(slide.slideNumber, imageUrl)}
                    />
                  </div>
                  
                  <div className="flex justify-center w-[360px]">
                    <Button 
                      onClick={() => slideRefs.current[index]?.download()}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download size={14} />
                      Download Slide {slide.slideNumber}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
