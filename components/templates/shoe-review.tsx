"use client"

import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import { toPng } from "html-to-image"

import type { SlideData, SlideRef } from "@/components/slide"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChecklistItem } from "@/components/ui/checklist-item"
import { ChevronUp, ChevronDown, ZoomIn, ZoomOut, Plus, Minus } from "lucide-react"

interface ShoeReviewSlideProps {
  slide: SlideData
  textColor?: string
  currentImageUrl?: string
  slide2FontSize?: number
  slide2LineSpacing?: number
  slide2ImgScale?: number
  slide2TextPosX?: number
  slide2TextPosY?: number
  slide2ImgPosX?: number
  slide2ImgPosY?: number
  slide1ImgScale?: number
  slide1ImgPosY?: number
  slide1TitlePosY?: number
  slide1PricingPosY?: number
  slide1TitleFontSize?: number
  slide1TitleLineHeight?: number
  slide4SecondImage?: string
  slide4SecondImgPosX?: number
  slide4SecondImgPosY?: number
  slide4SecondImgScale?: number
  slide5Images?: Record<number, string>
  slide5ImgPositions?: Record<number, {x: number, y: number, scale: number}>
  // Accept theme for compatibility with generic renderer signature
  // even if we do not use it directly here
  theme?: unknown
}

function getBackgroundForSlide(slideNumber: number): string {
  // Map 1..5 to the provided shoe-review backgrounds
  const base = "/themes/shoe-review"
  switch (slideNumber) {
    case 1:
      return `${base}/shoe_review-bg1.png`
    case 2:
      return `${base}/shoe_review-bg2.png`
    case 3:
      return `${base}/shoe_review-bg3.png`
    case 4:
      return `${base}/shoe_review-bg4.png`
    case 5:
      return `${base}/shoe_review-bg5.png`
    default:
      return `${base}/shoe_review-bg1.png`
  }
}

export const ShoeReviewSlide = forwardRef<SlideRef, ShoeReviewSlideProps>(
  ({ 
    slide, 
    textColor = "#000000", 
    currentImageUrl = "", 
    slide2FontSize = 35, 
    slide2LineSpacing = 1.2,
    slide2ImgScale = 1,
    slide2TextPosX = 64,
    slide2TextPosY = 320,
    slide2ImgPosX = 64,
    slide2ImgPosY = 64,
    slide1ImgScale = 1,
    slide1ImgPosY = 0,
    slide1TitlePosY = 0,
    slide1PricingPosY = 0,
    slide1TitleFontSize = 120,
    slide1TitleLineHeight = 1.0,
    slide4SecondImage = '',
    slide4SecondImgPosX = 400,
    slide4SecondImgPosY = 400,
    slide4SecondImgScale = 1,
    slide5Images = {1: '', 2: '', 3: '', 4: ''},
    slide5ImgPositions = {1: {x: 100, y: 500, scale: 1}, 2: {x: 350, y: 500, scale: 1}, 3: {x: 600, y: 500, scale: 1}, 4: {x: 850, y: 500, scale: 1}}
  }, ref) => {
    const { title, subtitle, bullets, quotes, callout, slideNumber } = slide
    const slideRef = useRef<HTMLDivElement>(null)


    const handleDownload = async () => {
      if (slideRef.current === null) return
      const dataUrl = await toPng(slideRef.current, {
        cacheBust: true,
        width: 1080,
        height: 1350,
        pixelRatio: 2,
        style: { transform: "scale(1)", transformOrigin: "top left" },
      })
      const link = document.createElement("a")
      link.download = `${slideNumber}.png`
      link.href = dataUrl
      link.click()
    }

    useImperativeHandle(ref, () => ({ download: handleDownload }))

    // Intro (slide 1): shoe image area (center), title area (below), pricing line
    if (slideNumber === 1) {
      const effectiveTitleColor = "#FFFFFF"
      const priceText = callout || ""
      // Detect a pricing level bullet like "- $$$$" (1..5 $)
      const priceLevelFromBullets = (() => {
        if (!bullets || bullets.length === 0) return 0
        const match = bullets.find((b) => /^\$+$/.test(b.trim()))
        if (!match) return 0
        const level = match.trim().length
        return Math.max(1, Math.min(5, level))
      })()
      const displayTitle = (title || "").replace(/\s*\|\s*/g, "\n")
      return (
        <div className="relative">
          <div
            ref={slideRef}
            className="relative overflow-hidden"
            style={{ width: "1080px", height: "1350px" }}
          >
            {/* Background */}
            <img
              src={getBackgroundForSlide(slideNumber)}
              alt="Background"
              className="object-cover absolute inset-0 w-full h-full"
            />

            {/* Shoe image area */}
            <div
              className="absolute left-1/2"
              style={{ 
                top: 300 + slide1ImgPosY, 
                width: 980, 
                height: 460, 
                transform: `translateX(-50%) scale(${slide1ImgScale})`,
                transition: 'transform 0.2s ease-in-out'
              }}
            >
              {currentImageUrl ? (
                <img
                  src={currentImageUrl}
                  alt="Shoe"
                  className="object-contain w-full h-full"
                />
              ) : (
                <div className="w-full h-full border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center">
                  <div className="text-white/60 text-center">
                    <div className="text-2xl mb-2">👟</div>
                    <div className="text-lg">Upload shoe image</div>
                  </div>
                </div>
              )}
            </div>

            {/* Title area */}
            {title && (
              <div className="absolute left-1/2 flex justify-center text-center"
                   style={{ bottom: 220 - slide1TitlePosY, width: 1000, transform: `translateX(-50%)`, transition: 'transform 0.2s ease-in-out' }}>
                <h1 className="font-title font-bold tracking-tight text-center break-words"
                    style={{ fontSize: slide1TitleFontSize, lineHeight: slide1TitleLineHeight, color: effectiveTitleColor, whiteSpace: "pre-line" }}>
                  {displayTitle.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < displayTitle.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </h1>
              </div>
            )}

            {/* Pricing (either level scale from bullets or callout text) */}
            {(priceLevelFromBullets > 0 || priceText) && (
              <div className="absolute left-1/2 text-center"
                   style={{ bottom: 160 - slide1PricingPosY, width: 1000, transform: `translateX(-50%)`, transition: 'transform 0.2s ease-in-out' }}>
                {priceLevelFromBullets > 0 ? (
                  <div style={{ fontSize: 44, fontWeight: 700 }}>
                    <span style={{ color: '#9ca3af' }}>(</span>
                    {new Array(5).fill(0).map((_, i) => (
                      <span key={i} style={{ color: i < priceLevelFromBullets ? '#00cc88' : '#6b7280' }}>$</span>
                    ))}
                    <span style={{ color: '#9ca3af' }}>)</span>
                  </div>
                ) : (
                  <div style={{ fontSize: 44, color: "#00cc88", fontWeight: 700 }}>
                    <ReactMarkdown>{priceText}</ReactMarkdown>
                  </div>
                )}
              </div>
            )}
          </div>


        </div>
      )
    }

    // Slide 2: Who is this shoe for?
    if (slideNumber === 2) {
      return (
        <div className="relative">
          <div ref={slideRef} className="relative overflow-hidden" style={{ width: "1080px", height: "1350px" }}>
            <img src={getBackgroundForSlide(slideNumber)} alt="Background" className="object-cover absolute inset-0 w-full h-full" />
            
            {/* Checklist */}
            <div 
              className="absolute w-4/5"
              style={{ 
                left: `${slide2TextPosX}px`,
                top: `${slide2TextPosY}px`
              }}
            >
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: `${slide2LineSpacing * 20}px` 
              }}>
                {bullets?.map((bullet, index) => (
                  <ChecklistItem
                    key={index}
                    type="check"
                    text={bullet}
                    fontSize={slide2FontSize}
                    lineSpacing={slide2LineSpacing}
                  />
                ))}
              </div>
            </div>

            {/* Shoe Image */}
            {currentImageUrl && (
              <div 
                className="absolute w-96 h-80"
                style={{ 
                  left: `${slide2ImgPosX}px`,
                  top: `${slide2ImgPosY}px`,
                  transform: `scale(${slide2ImgScale})`,
                  transformOrigin: 'top left',
                  transition: 'transform 0.2s ease-in-out'
                }}
              >
                <img src={currentImageUrl} alt="Shoe" className="w-full h-full object-contain" />
              </div>
            )}
          </div>
        </div>
      )
    }

    // Slide 3: Who should avoid this shoe? (identical to Slides 2 and 4 but with slide 3 background)
    if (slideNumber === 3) {
      return (
        <div className="relative">
          <div ref={slideRef} className="relative overflow-hidden" style={{ width: "1080px", height: "1350px" }}>
            <img src={getBackgroundForSlide(slideNumber)} alt="Background" className="object-cover absolute inset-0 w-full h-full" />
            
            {/* Checklist */}
            <div 
              className="absolute w-4/5"
              style={{ 
                left: `${slide2TextPosX}px`,
                top: `${slide2TextPosY}px`
              }}
            >
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: `${slide2LineSpacing * 20}px` 
              }}>
                {bullets?.map((bullet, index) => (
                  <ChecklistItem
                    key={index}
                    type="cross"
                    text={bullet}
                    fontSize={slide2FontSize}
                    lineSpacing={slide2LineSpacing}
                  />
                ))}
              </div>
            </div>

            {/* Shoe Image */}
            {currentImageUrl && (
              <div 
                className="absolute w-96 h-80"
                style={{ 
                  left: `${slide2ImgPosX}px`,
                  top: `${slide2ImgPosY}px`,
                  transform: `scale(${slide2ImgScale})`,
                  transformOrigin: 'top left',
                  transition: 'transform 0.2s ease-in-out'
                }}
              >
                <img src={currentImageUrl} alt="Shoe" className="w-full h-full object-contain" />
              </div>
            )}
          </div>
        </div>
      )
    }

    // Slide 4: Alternatives (uses 🔁 icon and supports 2 images)
    if (slideNumber === 4) {
      return (
        <div className="relative">
          <div ref={slideRef} className="relative overflow-hidden" style={{ width: "1080px", height: "1350px" }}>
            <img src={getBackgroundForSlide(slideNumber)} alt="Background" className="object-cover absolute inset-0 w-full h-full" />
            
            {/* Checklist */}
            <div 
              className="absolute w-4/5"
              style={{ 
                left: `${slide2TextPosX}px`,
                top: `${slide2TextPosY}px`
              }}
            >
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: `${slide2LineSpacing * 20}px` 
              }}>
                {bullets?.map((bullet, index) => (
                  <ChecklistItem
                    key={index}
                    type="rotate"
                    text={bullet}
                    fontSize={slide2FontSize}
                    lineSpacing={slide2LineSpacing}
                  />
                ))}
              </div>
            </div>

            {/* First Shoe Image */}
            {currentImageUrl && (
              <div 
                className="absolute w-96 h-80"
                style={{ 
                  left: `${slide2ImgPosX}px`,
                  top: `${slide2ImgPosY}px`,
                  transform: `scale(${slide2ImgScale})`,
                  transformOrigin: 'top left',
                  transition: 'transform 0.2s ease-in-out'
                }}
              >
                <img src={currentImageUrl} alt="Alternative Shoe 1" className="w-full h-full object-contain" />
              </div>
            )}

            {/* Second Shoe Image */}
            {slide4SecondImage && (
              <div 
                className="absolute w-96 h-80"
                style={{ 
                  left: `${slide4SecondImgPosX}px`,
                  top: `${slide4SecondImgPosY}px`,
                  transform: `scale(${slide4SecondImgScale})`,
                  transformOrigin: 'top left',
                  transition: 'transform 0.2s ease-in-out'
                }}
              >
                <img src={slide4SecondImage} alt="Alternative Shoe 2" className="w-full h-full object-contain" />
              </div>
            )}
          </div>
        </div>
      )
    }

    // Slide 5: Poll for next review
    if (slideNumber === 5) {
      return (
        <div className="relative">
          <div ref={slideRef} className="relative overflow-hidden" style={{ width: "1080px", height: "1350px" }}>
            <img src={getBackgroundForSlide(slideNumber)} alt="Background" className="object-cover absolute inset-0 w-full h-full" />

            {/* Options List */}
            <div 
              className="absolute w-4/5"
              style={{ 
                left: `${slide2TextPosX}px`,
                top: `${slide2TextPosY}px`
              }}
            >
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: `${slide2LineSpacing * 20}px` 
              }}>
                {bullets?.map((bullet, index) => (
                  <ChecklistItem
                    key={index}
                    type="number"
                    text={bullet}
                    index={index + 1}
                    fontSize={slide2FontSize}
                    lineSpacing={slide2LineSpacing}
                  />
                ))}
              </div>
            </div>

            {/* Image positions for 4 images */}
            {slide5Images[1] && (
              <img 
                src={slide5Images[1]} 
                alt="Image 1" 
                className="absolute object-contain"
                style={{
                  left: `${slide5ImgPositions[1].x}px`,
                  top: `${slide5ImgPositions[1].y}px`,
                  width: `${200 * slide5ImgPositions[1].scale}px`,
                  height: `${200 * slide5ImgPositions[1].scale}px`,
                }}
              />
            )}
            {slide5Images[2] && (
              <img 
                src={slide5Images[2]} 
                alt="Image 2" 
                className="absolute object-contain"
                style={{
                  left: `${slide5ImgPositions[2].x}px`,
                  top: `${slide5ImgPositions[2].y}px`,
                  width: `${200 * slide5ImgPositions[2].scale}px`,
                  height: `${200 * slide5ImgPositions[2].scale}px`,
                }}
              />
            )}
            {slide5Images[3] && (
              <img 
                src={slide5Images[3]} 
                alt="Image 3" 
                className="absolute object-contain"
                style={{
                  left: `${slide5ImgPositions[3].x}px`,
                  top: `${slide5ImgPositions[3].y}px`,
                  width: `${200 * slide5ImgPositions[3].scale}px`,
                  height: `${200 * slide5ImgPositions[3].scale}px`,
                }}
              />
            )}
            {slide5Images[4] && (
              <img 
                src={slide5Images[4]} 
                alt="Image 4" 
                className="absolute object-contain"
                style={{
                  left: `${slide5ImgPositions[4].x}px`,
                  top: `${slide5ImgPositions[4].y}px`,
                  width: `${200 * slide5ImgPositions[4].scale}px`,
                  height: `${200 * slide5ImgPositions[4].scale}px`,
                }}
              />
            )}
          </div>
        </div>
      )
    }

    // Default simple layout for other slides (placeholder)
    return (
      <div className="relative">
        <div ref={slideRef} className="relative overflow-hidden" style={{ width: "1080px", height: "1350px" }}>
          <img src={getBackgroundForSlide(slideNumber)} alt="Background" className="object-cover absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 px-16 pt-20 pb-12 flex flex-col gap-6 items-center">
            {title && (
              <h1 className="uppercase text-center leading-none mb-2 px-8" style={{ fontSize: "100px", lineHeight: "0.9", color: textColor }}>
                <ReactMarkdown>{title}</ReactMarkdown>
              </h1>
            )}
            {subtitle && (<div className="text-center" style={{ fontSize: "36px", color: textColor }}><ReactMarkdown>{subtitle}</ReactMarkdown></div>)}
            {bullets && bullets.length > 0 && (
              <ul className="text-left" style={{ fontSize: "28px", color: textColor }}>
                {bullets.map((b, i) => (<li key={i} className="mb-2"><ReactMarkdown components={{ p: "span" }}>{b}</ReactMarkdown></li>))}
              </ul>
            )}
            {quotes && quotes.length > 0 && (
              <div className="text-center" style={{ fontSize: "32px", color: textColor }}>
                {quotes.map((q, i) => (<div key={i} className="mb-3 italic"><ReactMarkdown>{q}</ReactMarkdown></div>))}
              </div>
            )}
            {callout && (<div className="text-center font-bold" style={{ fontSize: "40px", color: textColor }}><ReactMarkdown>{callout}</ReactMarkdown></div>)}
            {currentImageUrl && (
              <div className="flex items-center justify-center w-full mt-auto">
                <img src={currentImageUrl} alt={`Slide ${slideNumber} content`} className="object-contain rounded-lg" style={{ width: "700px", height: "450px" }} />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
)

ShoeReviewSlide.displayName = "ShoeReviewSlide"


