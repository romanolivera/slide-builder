"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Download, DownloadCloud } from "lucide-react"
import { Slide, type SlideData, type SlideRef } from "@/components/slide"
import { ImageUpload } from "@/components/image-upload"
import { Settings } from "@/components/settings"
import { Theme, getBestAvailableTheme } from "@/lib/themes"
import { Instructions } from "@/components/instructions"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getTranslation } from "@/lib/translations"

const defaultMarkdown = `## Si tu ego es frágil... no veas este carrusel
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

---

## Su cuerpo no es de este planeta
La variabilidad de la frecuencia cardíaca (HRV) refleja qué tan recuperado o estresado esta tu cuerpo.
- HRV promedio: 30-50
- Pogačar: **120-150**

---

## La máquina perfecta
- VO2 max promedio: 40-50 ml/kg/min
- Pogačar: **88 ml/kg/min**
- Su umbral anaeróbico: **85% del VO2 max**

---

## ¿Y tu entrenamiento?
- ¿Cuántas horas semanales dedicas al entrenamiento?
- ¿Qué tan específico es tu plan?
- ¿Mides tu progreso?

---

## La realidad
Los datos no mienten. La diferencia entre un mortal y un campeón es abismal.`

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
  const [textColor, setTextColor] = useState('#000000')
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => getBestAvailableTheme())
  const [language, setLanguage] = useState<'es' | 'en'>('es') // Default to Spanish
  const slides = useMemo(() => parseMarkdownToSlides(markdown), [markdown])
  const slideRefs = useRef<(SlideRef | null)[]>([])
  const t = getTranslation(language)

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
  }

  const handleBackgroundChange = async (type: 'first' | 'middle' | 'last', file: File) => {
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('backgroundType', type)

      const response = await fetch('/api/upload-background', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload background')
      }

      const result = await response.json()
      if (result.success) {
        // Background uploaded successfully
        console.log('Background uploaded successfully')
      }
    } catch (error) {
      console.error('Background upload error:', error)
      throw error
    }
  }

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme)
    // Save the theme selection permanently
    import('@/lib/themes').then(({ saveCurrentTheme }) => {
      saveCurrentTheme(theme)
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">{t.common.loading}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t.header.title}</h1>
              <p className="text-gray-600 mt-1">{t.header.subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
              <Instructions language={language} />
              <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{t.input.title}</h2>
              <span className="text-sm text-gray-500">{slides.length} {t.common.slides}</span>
            </div>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-[600px] font-mono text-sm resize-none"
              placeholder={t.input.placeholder}
            />
            <div className="text-xs text-gray-500">
              {t.input.help}
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{t.preview.title}</h2>
              {slides.length > 0 && (
                <Button 
                  onClick={handleDownloadAll} 
                  disabled={isDownloadingAll}
                  className="flex items-center gap-2"
                >
                  <DownloadCloud size={16} />
                  {isDownloadingAll ? t.preview.downloading : `${t.preview.downloadAll} (${slides.length})`}
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
                        currentImageUrl={slideImages[slide.slideNumber] || ''}
                        textColor={currentTheme.textColor}
                        theme={currentTheme}
                      />
                    </div>
                  </div>
                  
                  {/* Image Upload Interface */}
                  <div className="space-y-2 w-[360px]">
                    <div className="text-sm font-medium text-gray-700">{t.preview.slideImage} {slide.slideNumber}</div>
                    <ImageUpload
                      slideNumber={slide.slideNumber}
                      currentImageUrl={slideImages[slide.slideNumber] || ''}
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
                      {t.preview.downloadSlide} {slide.slideNumber}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* Settings Component */}
      <Settings
        onBackgroundChange={handleBackgroundChange}
        onTextColorChange={setTextColor}
        onThemeChange={handleThemeChange}
        currentTextColor={textColor}
        currentTheme={currentTheme}
        language={language}
      />
    </div>
  )
}
