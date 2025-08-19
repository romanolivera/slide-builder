"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Download, DownloadCloud } from "lucide-react"
import { Slide, type SlideData, type SlideRef } from "@/components/slide"
import { ShoeReviewSlide } from "@/components/templates/shoe-review"
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

function generateShoeReviewSlides(): SlideData[] {
  return [
    {
      title: "Nike Air Zoom Pegasus 40",
      bullets: ["$$$$"],
      slideNumber: 1,
      isFirstSlide: true,
      isLastSlide: false,
    },
    {
      title: "¿Para quién?",
      subtitle: "Who is this shoe for?",
      bullets: ["Pasos entre 3:00 y 4:45 min/km", "Neutral runners", "Medium to high mileage"],
      slideNumber: 2,
      isFirstSlide: false,
      isLastSlide: false,
    },
    {
      title: "¿Para quién NO?",
      subtitle: "Who should avoid this shoe?",
      bullets: ["Racing", "Trail running", "Severe overpronation"],
      slideNumber: 3,
      isFirstSlide: false,
      isLastSlide: false,
    },
    {
      title: "Alternativas",
      subtitle: "Similar options to consider",
      bullets: ["Brooks Ghost 15", "Saucony Ride 16", "Hoka Clifton 9"],
      slideNumber: 4,
      isFirstSlide: false,
      isLastSlide: false,
    },
    {
      title: "Elige el siguiente review",
      subtitle: "Vote for the next review",
      bullets: ["Adidas Ultraboost Light", "Asics Gel-Nimbus 25", "New Balance Fresh Foam X"],
      slideNumber: 5,
      isFirstSlide: false,
      isLastSlide: true,
    }
  ]
}

export default function SlideBuilderPage() {
  const [markdown, setMarkdown] = useState(defaultMarkdown)
  const [textColor, setTextColor] = useState("#000000")
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => getBestAvailableTheme())
  const [slideImages, setSlideImages] = useState<Record<number, string>>({})
  const [slide4SecondImage, setSlide4SecondImage] = useState<string>('')
  const [slide5Images, setSlide5Images] = useState<Record<number, string>>({1: '', 2: '', 3: '', 4: ''})
  const [slide5SelectedImage, setSlide5SelectedImage] = useState<number>(1)
  const [slide5ImgPositions, setSlide5ImgPositions] = useState<Record<number, {x: number, y: number, scale: number}>>({
    1: {x: 100, y: 500, scale: 1},
    2: {x: 350, y: 500, scale: 1},
    3: {x: 600, y: 500, scale: 1},
    4: {x: 850, y: 500, scale: 1}
  })
  const [language, setLanguage] = useState<'es' | 'en'>('es') // Default to Spanish
  const [isDownloadingAll, setIsDownloadingAll] = useState(false)
  const [customShoeReviewSlides, setCustomShoeReviewSlides] = useState<SlideData[]>([])
  // Individual slide settings
  const [slideSettings, setSlideSettings] = useState<Record<number, {
    fontSize: number
    lineSpacing: number
    imgScale: number
    textPosX: number
    textPosY: number
    imgPosX: number
    imgPosY: number
  }>>({
    2: { fontSize: 35, lineSpacing: 1.2, imgScale: 1, textPosX: 16, textPosY: 320, imgPosX: 64, imgPosY: 64 },
    3: { fontSize: 35, lineSpacing: 1.2, imgScale: 1, textPosX: 16, textPosY: 320, imgPosX: 64, imgPosY: 64 },
    4: { fontSize: 35, lineSpacing: 1.2, imgScale: 1, textPosX: 16, textPosY: 320, imgPosX: 64, imgPosY: 64 },
    5: { fontSize: 30, lineSpacing: 1.2, imgScale: 1, textPosX: 16, textPosY: 320, imgPosX: 64, imgPosY: 64 }
  })
  const [slide4SecondImgPosX, setSlide4SecondImgPosX] = useState(400)
  const [slide4SecondImgPosY, setSlide4SecondImgPosY] = useState(400)
  const [slide4SecondImgScale, setSlide4SecondImgScale] = useState(1)
  
  // Slide 1 controls
  const [slide1ImgScale, setSlide1ImgScale] = useState(1)
  const [slide1ImgPosY, setSlide1ImgPosY] = useState(0)
  const [slide1TitlePosY, setSlide1TitlePosY] = useState(0)
  const [slide1PricingPosY, setSlide1PricingPosY] = useState(0)
  const [slide1TitleFontSize, setSlide1TitleFontSize] = useState(120)
  const [slide1TitleLineHeight, setSlide1TitleLineHeight] = useState(1.0)
  
  const slideRefs = useRef<(SlideRef | null)[]>([])

  const t = getTranslation(language)

  // Initialize custom shoe review slides
  useEffect(() => {
    if (currentTheme.id === 'shoe-review' && customShoeReviewSlides.length === 0) {
      setCustomShoeReviewSlides(generateShoeReviewSlides())
    }
  }, [currentTheme.id, customShoeReviewSlides.length])

  // Generate slides based on theme
  const slides = useMemo(() => {
    if (currentTheme.id === 'shoe-review') {
      return customShoeReviewSlides.length > 0 ? customShoeReviewSlides : generateShoeReviewSlides()
    }
    return parseMarkdownToSlides(markdown)
  }, [currentTheme.id, markdown, customShoeReviewSlides])

  // Update slide content
  const updateSlideContent = (slideIndex: number, field: keyof SlideData, value: any) => {
    if (currentTheme.id === 'shoe-review') {
      const newSlides = [...customShoeReviewSlides]
      newSlides[slideIndex] = { ...newSlides[slideIndex], [field]: value }
      setCustomShoeReviewSlides(newSlides)
    }
  }

  // Update bullet point
  const updateBulletPoint = (slideIndex: number, bulletIndex: number, value: string) => {
    if (currentTheme.id === 'shoe-review') {
      const newSlides = [...customShoeReviewSlides]
      const newBullets = [...(newSlides[slideIndex].bullets || [])]
      newBullets[bulletIndex] = value
      newSlides[slideIndex] = { ...newSlides[slideIndex], bullets: newBullets }
      setCustomShoeReviewSlides(newSlides)
    }
  }

  // Add bullet point
  const addBulletPoint = (slideIndex: number) => {
    if (currentTheme.id === 'shoe-review') {
      const newSlides = [...customShoeReviewSlides]
      const newBullets = [...(newSlides[slideIndex].bullets || [])]
      newBullets.push('') // Add empty bullet point
      newSlides[slideIndex] = { ...newSlides[slideIndex], bullets: newBullets }
      setCustomShoeReviewSlides(newSlides)
    }
  }

  // Remove bullet point
  const removeBulletPoint = (slideIndex: number, bulletIndex: number) => {
    if (currentTheme.id === 'shoe-review') {
      const newSlides = [...customShoeReviewSlides]
      const newBullets = [...(newSlides[slideIndex].bullets || [])]
      newBullets.splice(bulletIndex, 1) // Remove bullet point at index
      newSlides[slideIndex] = { ...newSlides[slideIndex], bullets: newBullets }
      setCustomShoeReviewSlides(newSlides)
    }
  }

  // Update individual slide setting
  const updateSlideSetting = (slideNumber: number, setting: string, value: any) => {
    setSlideSettings(prev => ({
      ...prev,
      [slideNumber]: {
        ...prev[slideNumber],
        [setting]: value
      }
    }))
  }

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
        // setIsLoading(false) // This state was removed
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

  // if (isLoading) { // This state was removed
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-lg">{t.common.loading}</div>
  //     </div>
  //   )
  // }

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
          <div className="space-y-4 max-h-[1200px] overflow-y-auto pr-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{t.input.title}</h2>
              <span className="text-sm text-gray-500">{slides.length} {t.common.slides}</span>
            </div>
            
            {currentTheme.id === 'shoe-review' ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Shoe Review Template</h3>
                  <p className="text-blue-800 text-sm mb-3">
                    This template automatically generates 5 slides for shoe reviews. Each slide has a specific purpose and background.
                  </p>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div><strong>Slide 1:</strong> Shoe introduction with image area and pricing</div>
                    <div><strong>Slide 2:</strong> Who this shoe is for (target audience)</div>
                    <div><strong>Slide 3:</strong> Who should avoid this shoe</div>
                    <div><strong>Slide 4:</strong> Alternative options to consider</div>
                    <div><strong>Slide 5:</strong> Poll for next review selection</div>
                  </div>
                </div>
                
                {/* Editable content for each slide */}
                <div className="space-y-4">
                  {slides.map((slide, index) => (
                    <div key={slide.slideNumber} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <h4 className="font-semibold text-gray-900 mb-3">Slide {slide.slideNumber}: {slide.title}</h4>
                      
                                              <div className="space-y-3">
                        {slide.slideNumber !== 2 && slide.slideNumber !== 5 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                              type="text"
                              value={slide.title}
                              onChange={(e) => updateSlideContent(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                        )}
                        {slide.slideNumber !== 1 && slide.slideNumber !== 2 && slide.slideNumber !== 3 && slide.slideNumber !== 4 && slide.slideNumber !== 5 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                            <input
                              type="text"
                              value={slide.subtitle || ''}
                              onChange={(e) => updateSlideContent(index, 'subtitle', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                        )}
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">Bullet Points</label>
                            {(slide.slideNumber === 2 || slide.slideNumber === 3 || slide.slideNumber === 4 || slide.slideNumber === 5) && (
                              <button
                                onClick={() => addBulletPoint(index)}
                                className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                              >
                                + Add
                              </button>
                            )}
                          </div>
                          {slide.bullets?.map((bullet, bulletIndex) => (
                            slide.slideNumber === 1 && bulletIndex > 0 ? null : (
                              <div key={bulletIndex} className="flex items-center gap-2 mb-2">
                                <input
                                  type="text"
                                  value={bullet}
                                  onChange={(e) => updateBulletPoint(index, bulletIndex, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                                />
                                {(slide.slideNumber === 2 || slide.slideNumber === 3 || slide.slideNumber === 4 || slide.slideNumber === 5) && slide.bullets && slide.bullets.length > 1 && (
                                  <button
                                    onClick={() => removeBulletPoint(index, bulletIndex)}
                                    className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            )
                          ))}
                        </div>
                        
                        {/* Controls for Slide 1 */}
                        {slide.slideNumber === 1 && (
                          <div className="space-y-4 border-t pt-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title Font Size</label>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setSlide1TitleFontSize(prev => Math.max(60, prev - 4))}
                                    className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    value={slide1TitleFontSize}
                                    onChange={(e) => setSlide1TitleFontSize(Math.max(60, Math.min(220, parseInt(e.target.value) || 60)))}
                                    className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded"
                                    min="60"
                                    max="220"
                                  />
                                  <button
                                    onClick={() => setSlide1TitleFontSize(prev => Math.min(220, prev + 4))}
                                    className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title Line Height</label>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setSlide1TitleLineHeight(prev => Math.max(0.7, +(prev - 0.02).toFixed(2)))}
                                    className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    value={slide1TitleLineHeight.toFixed(2)}
                                    onChange={(e) => setSlide1TitleLineHeight(Math.max(0.7, Math.min(1.6, parseFloat(e.target.value) || 0.7)))}
                                    className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded"
                                    min="0.7"
                                    max="1.6"
                                    step="0.01"
                                  />
                                  <button
                                    onClick={() => setSlide1TitleLineHeight(prev => Math.min(1.6, +(prev + 0.02).toFixed(2)))}
                                    className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Text Positioning</label>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <div className="text-xs text-gray-600 mb-1">Title Y</div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setSlide1TitlePosY(prev => Math.max(-200, prev - 10))}
                                      className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                    >
                                      ↑
                                    </button>
                                    <input
                                      type="number"
                                      value={slide1TitlePosY}
                                      onChange={(e) => setSlide1TitlePosY(Math.max(-200, Math.min(200, parseInt(e.target.value) || 0)))}
                                      className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded"
                                      min="-200"
                                      max="200"
                                    />
                                    <button
                                      onClick={() => setSlide1TitlePosY(prev => Math.min(200, prev + 10))}
                                      className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                    >
                                      ↓
                                    </button>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-600 mb-1">Price Y</div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setSlide1PricingPosY(prev => Math.max(-200, prev - 10))}
                                      className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                    >
                                      ↑
                                    </button>
                                    <input
                                      type="number"
                                      value={slide1PricingPosY}
                                      onChange={(e) => setSlide1PricingPosY(Math.max(-200, Math.min(200, parseInt(e.target.value) || 0)))}
                                      className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded"
                                      min="-200"
                                      max="200"
                                    />
                                    <button
                                      onClick={() => setSlide1PricingPosY(prev => Math.min(200, prev + 10))}
                                      className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                    >
                                      ↓
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Font and Position controls for Slides 2, 3, 4, and 5 */}
                        {(slide.slideNumber === 2 || slide.slideNumber === 3 || slide.slideNumber === 4 || slide.slideNumber === 5) && (
                          <div className="space-y-4 border-t pt-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => updateSlideSetting(slide.slideNumber, 'fontSize', Math.max(20, slideSettings[slide.slideNumber].fontSize - 2))}
                                    className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    value={slideSettings[slide.slideNumber].fontSize}
                                    onChange={(e) => updateSlideSetting(slide.slideNumber, 'fontSize', Math.max(20, Math.min(60, parseInt(e.target.value) || 20)))}
                                    className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded"
                                    min="20"
                                    max="60"
                                  />
                                  <button
                                    onClick={() => updateSlideSetting(slide.slideNumber, 'fontSize', Math.min(60, slideSettings[slide.slideNumber].fontSize + 2))}
                                    className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Line Spacing</label>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => updateSlideSetting(slide.slideNumber, 'lineSpacing', Math.max(1.0, +(slideSettings[slide.slideNumber].lineSpacing - 0.1).toFixed(1)))}
                                    className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    value={slideSettings[slide.slideNumber].lineSpacing.toFixed(1)}
                                    onChange={(e) => updateSlideSetting(slide.slideNumber, 'lineSpacing', Math.max(1.0, parseFloat(e.target.value) || 1.0))}
                                    className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded"
                                    min="1.0"
                                    step="0.1"
                                  />
                                  <button
                                    onClick={() => updateSlideSetting(slide.slideNumber, 'lineSpacing', +(slideSettings[slide.slideNumber].lineSpacing + 0.1).toFixed(1))}
                                    className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Text Position</label>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <div className="text-xs text-gray-600 mb-1">X Position</div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => updateSlideSetting(slide.slideNumber, 'textPosX', slideSettings[slide.slideNumber].textPosX - 10)}
                                      className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                    >
                                      ←
                                    </button>
                                    <input
                                      type="number"
                                      value={slideSettings[slide.slideNumber].textPosX}
                                      onChange={(e) => updateSlideSetting(slide.slideNumber, 'textPosX', parseInt(e.target.value) || 0)}
                                      className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded"
                                    />
                                    <button
                                      onClick={() => updateSlideSetting(slide.slideNumber, 'textPosX', slideSettings[slide.slideNumber].textPosX + 10)}
                                      className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                    >
                                      →
                                    </button>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-600 mb-1">Y Position</div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => updateSlideSetting(slide.slideNumber, 'textPosY', slideSettings[slide.slideNumber].textPosY - 10)}
                                      className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                    >
                                      ↑
                                    </button>
                                    <input
                                      type="number"
                                      value={slideSettings[slide.slideNumber].textPosY}
                                      onChange={(e) => updateSlideSetting(slide.slideNumber, 'textPosY', parseInt(e.target.value) || 0)}
                                      className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded"
                                    />
                                    <button
                                      onClick={() => updateSlideSetting(slide.slideNumber, 'textPosY', slideSettings[slide.slideNumber].textPosY + 10)}
                                      className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                    >
                                      ↓
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <Textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  className="w-full h-[600px] font-mono text-sm resize-none"
                  placeholder={t.input.placeholder}
                />
                <div className="text-xs text-gray-500">
                  {t.input.help}
                </div>
              </>
            )}
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
            <div className="space-y-8 max-h-[1200px] overflow-y-auto pr-4">
              {slides.map((slide, index) => (
                <div key={slide.slideNumber} className="space-y-4 flex flex-col items-center">
                  <div className="w-[360px] aspect-[1080/1350] bg-white border rounded-lg shadow relative overflow-hidden flex items-center justify-center">
                    <div style={{ width: '1080px', height: '1350px', position: 'absolute', top: 0, left: 0, transform: 'scale(0.333)', transformOrigin: 'top left' }}>
                      {currentTheme.id === 'shoe-review' ? (
                        <ShoeReviewSlide
                          ref={(el) => {
                            slideRefs.current[index] = el
                          }}
                          slide={slide}
                          currentImageUrl={slideImages[slide.slideNumber] || ''}
                          textColor={currentTheme.textColor}
                          slide2FontSize={slideSettings[slide.slideNumber]?.fontSize || 35}
                          slide2LineSpacing={slideSettings[slide.slideNumber]?.lineSpacing || 1.2}
                          slide2ImgScale={slideSettings[slide.slideNumber]?.imgScale || 1}
                          slide2TextPosX={slideSettings[slide.slideNumber]?.textPosX || 16}
                          slide2TextPosY={slideSettings[slide.slideNumber]?.textPosY || 320}
                          slide2ImgPosX={slideSettings[slide.slideNumber]?.imgPosX || 64}
                          slide2ImgPosY={slideSettings[slide.slideNumber]?.imgPosY || 64}
                          slide1ImgScale={slide1ImgScale}
                          slide1ImgPosY={slide1ImgPosY}
                          slide1TitlePosY={slide1TitlePosY}
                          slide1PricingPosY={slide1PricingPosY}
                          slide1TitleFontSize={slide1TitleFontSize}
                          slide1TitleLineHeight={slide1TitleLineHeight}
                          slide4SecondImage={slide4SecondImage}
                          slide4SecondImgPosX={slide4SecondImgPosX}
                          slide4SecondImgPosY={slide4SecondImgPosY}
                          slide4SecondImgScale={slide4SecondImgScale}
                          slide5Images={slide5Images}
                          slide5ImgPositions={slide5ImgPositions}
                        />
                      ) : (
                      <Slide 
                        ref={(el) => {
                          slideRefs.current[index] = el
                        }}
                        slide={slide}
                        currentImageUrl={slideImages[slide.slideNumber] || ''}
                        textColor={currentTheme.textColor}
                        theme={currentTheme}
                      />
                      )}
                    </div>
                  </div>
                  
                  {/* Image Upload Interface */}
                  <div className="space-y-2 w-[360px]">
                    {currentTheme.id === 'shoe-review' && slide.slideNumber === 5 ? (
                      <>
                        <div className="text-sm font-medium text-gray-700">Slide 5 Images</div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Image to Edit</label>
                            <select
                              value={slide5SelectedImage}
                              onChange={(e) => setSlide5SelectedImage(parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option value={1}>Image 1</option>
                              <option value={2}>Image 2</option>
                              <option value={3}>Image 3</option>
                              <option value={4}>Image 4</option>
                            </select>
                          </div>
                          <ImageUpload
                            slideNumber={slide5SelectedImage + 100} // Use different number to distinguish
                            currentImageUrl={slide5Images[slide5SelectedImage]}
                            onImageUploaded={(imageUrl) => {
                              setSlide5Images(prev => ({
                                ...prev,
                                [slide5SelectedImage]: imageUrl
                              }))
                            }}
                          />
                          
                          {/* Image controls for selected image */}
                          <div className="border-t pt-3 space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Image Scale</label>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSlide5ImgPositions(prev => ({
                                    ...prev,
                                    [slide5SelectedImage]: {
                                      ...prev[slide5SelectedImage],
                                      scale: Math.max(0.5, +(prev[slide5SelectedImage].scale - 0.1).toFixed(1))
                                    }
                                  }))}
                                  className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  value={Math.round(slide5ImgPositions[slide5SelectedImage].scale * 100)}
                                  onChange={(e) => setSlide5ImgPositions(prev => ({
                                    ...prev,
                                    [slide5SelectedImage]: {
                                      ...prev[slide5SelectedImage],
                                      scale: Math.max(0.5, Math.min(5.0, (parseInt(e.target.value) || 50) / 100))
                                    }
                                  }))}
                                  className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded"
                                  min="50"
                                  max="500"
                                />
                                <button
                                  onClick={() => setSlide5ImgPositions(prev => ({
                                    ...prev,
                                    [slide5SelectedImage]: {
                                      ...prev[slide5SelectedImage],
                                      scale: Math.min(5.0, +(prev[slide5SelectedImage].scale + 0.1).toFixed(1))
                                    }
                                  }))}
                                  className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Image Position</label>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <div className="text-xs text-gray-600 mb-1">X Position</div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setSlide5ImgPositions(prev => ({
                                        ...prev,
                                        [slide5SelectedImage]: {
                                          ...prev[slide5SelectedImage],
                                          x: Math.max(0, prev[slide5SelectedImage].x - 10)
                                        }
                                      }))}
                                      className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                    >
                                      ←
                                    </button>
                                    <input
                                      type="number"
                                      value={slide5ImgPositions[slide5SelectedImage].x}
                                      onChange={(e) => setSlide5ImgPositions(prev => ({
                                        ...prev,
                                        [slide5SelectedImage]: {
                                          ...prev[slide5SelectedImage],
                                          x: Math.max(0, Math.min(1500, parseInt(e.target.value) || 0))
                                        }
                                      }))}
                                      className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded"
                                      min="0"
                                      max="1500"
                                    />
                                    <button
                                      onClick={() => setSlide5ImgPositions(prev => ({
                                        ...prev,
                                        [slide5SelectedImage]: {
                                          ...prev[slide5SelectedImage],
                                          x: Math.min(1500, prev[slide5SelectedImage].x + 10)
                                        }
                                      }))}
                                      className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                    >
                                      →
                                    </button>
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-600 mb-1">Y Position</div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setSlide5ImgPositions(prev => ({
                                        ...prev,
                                        [slide5SelectedImage]: {
                                          ...prev[slide5SelectedImage],
                                          y: prev[slide5SelectedImage].y - 10
                                        }
                                      }))}
                                      className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                    >
                                      ↑
                                    </button>
                                    <input
                                      type="number"
                                      value={slide5ImgPositions[slide5SelectedImage].y}
                                      onChange={(e) => setSlide5ImgPositions(prev => ({
                                        ...prev,
                                        [slide5SelectedImage]: {
                                          ...prev[slide5SelectedImage],
                                          y: parseInt(e.target.value) || 0
                                        }
                                      }))}
                                      className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded"
                                    />
                                    <button
                                      onClick={() => setSlide5ImgPositions(prev => ({
                                        ...prev,
                                        [slide5SelectedImage]: {
                                          ...prev[slide5SelectedImage],
                                          y: prev[slide5SelectedImage].y + 10
                                        }
                                      }))}
                                      className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                    >
                                      ↓
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-medium text-gray-700">{t.preview.slideImage} {slide.slideNumber}</div>
                        <ImageUpload
                          slideNumber={slide.slideNumber}
                          currentImageUrl={slideImages[slide.slideNumber] || ''}
                          onImageUploaded={(imageUrl) => handleImageUploaded(slide.slideNumber, imageUrl)}
                        />
                      </>
                    )}
                    
                    {/* Image controls for Slide 1 */}
                    {currentTheme.id === 'shoe-review' && slide.slideNumber === 1 && (
                      <div className="border-t pt-3 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Image Scale</label>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSlide1ImgScale(prev => Math.max(0.5, +(prev - 0.1).toFixed(1)))}
                              className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={Math.round(slide1ImgScale * 100)}
                              onChange={(e) => setSlide1ImgScale(Math.max(0.5, Math.min(2.5, (parseInt(e.target.value) || 50) / 100)))}
                              className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded"
                              min="50"
                              max="250"
                            />
                            <button
                              onClick={() => setSlide1ImgScale(prev => Math.min(2.5, +(prev + 0.1).toFixed(1)))}
                              className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Image Position</label>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Y Position</div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSlide1ImgPosY(prev => Math.max(-200, prev - 10))}
                                className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                              >
                                ↑
                              </button>
                              <input
                                type="number"
                                value={slide1ImgPosY}
                                onChange={(e) => setSlide1ImgPosY(Math.max(-200, Math.min(200, parseInt(e.target.value) || 0)))}
                                className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded"
                                min="-200"
                                max="200"
                              />
                              <button
                                onClick={() => setSlide1ImgPosY(prev => Math.min(200, prev + 10))}
                                className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                              >
                                ↓
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Image controls for Slides 2 and 3 */}
                    {currentTheme.id === 'shoe-review' && (slide.slideNumber === 2 || slide.slideNumber === 3) && (
                      <div className="border-t pt-3 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Image Scale</label>
                                                      <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateSlideSetting(slide.slideNumber, 'imgScale', Math.max(0.5, +(slideSettings[slide.slideNumber].imgScale - 0.1).toFixed(1)))}
                                className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                value={Math.round(slideSettings[slide.slideNumber].imgScale * 100)}
                                onChange={(e) => updateSlideSetting(slide.slideNumber, 'imgScale', Math.max(0.5, Math.min(2.5, (parseInt(e.target.value) || 50) / 100)))}
                                className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded"
                                min="50"
                                max="250"
                              />
                              <button
                                onClick={() => updateSlideSetting(slide.slideNumber, 'imgScale', Math.min(2.5, +(slideSettings[slide.slideNumber].imgScale + 0.1).toFixed(1)))}
                                className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                              >
                                +
                              </button>
                            </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Image Position</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <div className="text-xs text-gray-600 mb-1">X Position</div>
                                                              <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => updateSlideSetting(slide.slideNumber, 'imgPosX', slideSettings[slide.slideNumber].imgPosX - 10)}
                                    className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                  >
                                    ←
                                  </button>
                                  <input
                                    type="number"
                                    value={slideSettings[slide.slideNumber].imgPosX}
                                    onChange={(e) => updateSlideSetting(slide.slideNumber, 'imgPosX', parseInt(e.target.value) || 0)}
                                    className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded"
                                  />
                                  <button
                                    onClick={() => updateSlideSetting(slide.slideNumber, 'imgPosX', slideSettings[slide.slideNumber].imgPosX + 10)}
                                    className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                  >
                                    →
                                  </button>
                                </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600 mb-1">Y Position</div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateSlideSetting(slide.slideNumber, 'imgPosY', slideSettings[slide.slideNumber].imgPosY - 10)}
                                  className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                >
                                  ↑
                                </button>
                                <input
                                  type="number"
                                  value={slideSettings[slide.slideNumber].imgPosY}
                                                                        onChange={(e) => updateSlideSetting(slide.slideNumber, 'imgPosY', parseInt(e.target.value) || 0)}
                                      className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded"
                                />
                                <button
                                  onClick={() => updateSlideSetting(slide.slideNumber, 'imgPosY', slideSettings[slide.slideNumber].imgPosY + 10)}
                                  className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                >
                                  ↓
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Special image controls for Slide 4 (2 images) */}
                    {currentTheme.id === 'shoe-review' && slide.slideNumber === 4 && (
                      <div className="border-t pt-3 space-y-4">
                        {/* First Image Controls */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">First Image Controls</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Scale</label>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateSlideSetting(4, 'imgScale', Math.max(0.5, +(slideSettings[4].imgScale - 0.1).toFixed(1)))}
                                  className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  value={Math.round(slideSettings[4].imgScale * 100)}
                                  onChange={(e) => updateSlideSetting(4, 'imgScale', Math.max(0.5, Math.min(2.5, (parseInt(e.target.value) || 50) / 100)))}
                                  className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded"
                                  min="50"
                                  max="250"
                                />
                                <button
                                  onClick={() => updateSlideSetting(4, 'imgScale', Math.min(2.5, +(slideSettings[4].imgScale + 0.1).toFixed(1)))}
                                  className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <div className="text-xs text-gray-600 mb-1">X Position</div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => updateSlideSetting(4, 'imgPosX', slideSettings[4].imgPosX - 10)}
                                    className="px-1 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                  >
                                    ←
                                  </button>
                                  <input
                                    type="number"
                                    value={slideSettings[4].imgPosX}
                                    onChange={(e) => updateSlideSetting(4, 'imgPosX', parseInt(e.target.value) || 0)}
                                    className="w-10 px-1 py-1 text-xs text-center border border-gray-300 rounded"
                                  />
                                  <button
                                    onClick={() => updateSlideSetting(4, 'imgPosX', slideSettings[4].imgPosX + 10)}
                                    className="px-1 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                  >
                                    →
                                  </button>
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-600 mb-1">Y Position</div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => updateSlideSetting(4, 'imgPosY', slideSettings[4].imgPosY - 10)}
                                    className="px-1 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                  >
                                    ↑
                                  </button>
                                  <input
                                    type="number"
                                    value={slideSettings[4].imgPosY}
                                    onChange={(e) => updateSlideSetting(4, 'imgPosY', parseInt(e.target.value) || 0)}
                                    className="w-10 px-1 py-1 text-xs text-center border border-gray-300 rounded"
                                  />
                                  <button
                                    onClick={() => updateSlideSetting(4, 'imgPosY', slideSettings[4].imgPosY + 10)}
                                    className="px-1 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                  >
                                    ↓
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Second Image Upload */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Second Image</h4>
                          <ImageUpload
                            slideNumber={slide.slideNumber + 100} // Use different number to distinguish
                            currentImageUrl={slide4SecondImage}
                            onImageUploaded={(imageUrl) => setSlide4SecondImage(imageUrl)}
                          />
                          
                          {/* Second Image Controls */}
                          <div className="space-y-3 mt-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Scale</label>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSlide4SecondImgScale(prev => Math.max(0.5, +(prev - 0.1).toFixed(1)))}
                                  className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  value={Math.round(slide4SecondImgScale * 100)}
                                  onChange={(e) => setSlide4SecondImgScale(Math.max(0.5, Math.min(2.5, (parseInt(e.target.value) || 50) / 100)))}
                                  className="w-16 px-2 py-1 text-xs text-center border border-gray-300 rounded"
                                  min="50"
                                  max="250"
                                />
                                <button
                                  onClick={() => setSlide4SecondImgScale(prev => Math.min(2.5, +(prev + 0.1).toFixed(1)))}
                                  className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <div className="text-xs text-gray-600 mb-1">X Position</div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => setSlide4SecondImgPosX(prev => Math.max(0, prev - 10))}
                                    className="px-1 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                  >
                                    ←
                                  </button>
                                  <input
                                    type="number"
                                    value={slide4SecondImgPosX}
                                    onChange={(e) => setSlide4SecondImgPosX(Math.max(0, Math.min(800, parseInt(e.target.value) || 0)))}
                                    className="w-10 px-1 py-1 text-xs text-center border border-gray-300 rounded"
                                    min="0"
                                    max="800"
                                  />
                                  <button
                                    onClick={() => setSlide4SecondImgPosX(prev => Math.min(800, prev + 10))}
                                    className="px-1 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                  >
                                    →
                                  </button>
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-600 mb-1">Y Position</div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => setSlide4SecondImgPosY(prev => Math.max(0, prev - 10))}
                                    className="px-1 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                  >
                                    ↑
                                  </button>
                                  <input
                                    type="number"
                                    value={slide4SecondImgPosY}
                                    onChange={(e) => setSlide4SecondImgPosY(Math.max(0, Math.min(600, parseInt(e.target.value) || 0)))}
                                    className="w-10 px-1 py-1 text-xs text-center border border-gray-300 rounded"
                                    min="0"
                                    max="600"
                                  />
                                  <button
                                    onClick={() => setSlide4SecondImgPosY(prev => Math.min(600, prev + 10))}
                                    className="px-1 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                                  >
                                    ↓
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
