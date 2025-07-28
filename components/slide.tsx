"use client"

import { useRef, useState, forwardRef, useImperativeHandle } from "react"
import Image from "next/image"
import { ChevronUp, ChevronDown } from "lucide-react"
import { toPng } from "html-to-image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ReactMarkdown from 'react-markdown'

export interface SlideData {
  title: string
  subtitle?: string
  bullets?: string[]
  quotes?: string[]
  callout?: string
  slideNumber: number
  isFirstSlide: boolean
  isLastSlide?: boolean
}

interface SlideProps {
  slide: SlideData
}

export interface SlideRef {
  download: () => Promise<void>
}

type ElementType = 'title' | 'subtitle' | 'bullets' | 'quotes' | 'callout'

export const Slide = forwardRef<SlideRef, SlideProps>(({ slide }, ref) => {
  const { title, subtitle, bullets, quotes, callout, slideNumber, isFirstSlide, isLastSlide } = slide
  const slideRef = useRef<HTMLDivElement>(null)
  const [selectedElement, setSelectedElement] = useState<ElementType>('bullets')
  const [elementOffsets, setElementOffsets] = useState<Record<ElementType, number>>({
    title: 0,
    subtitle: 0,
    bullets: 0,
    quotes: 0,
    callout: 0
  })

  const handleDownload = async () => {
    if (slideRef.current === null) {
      return
    }

    try {
      const dataUrl = await toPng(slideRef.current, {
        cacheBust: true,
        width: 1080,
        height: 1350,
        pixelRatio: 2,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        },
      })

      const link = document.createElement("a")
      link.download = `${slideNumber}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Failed to generate image", err)
    }
  }

  useImperativeHandle(ref, () => ({
    download: handleDownload
  }))

  const handleElementMove = (direction: 'up' | 'down') => {
    const step = 20 // pixels per click
    setElementOffsets(prev => ({
      ...prev,
      [selectedElement]: direction === 'up' 
        ? prev[selectedElement] - step 
        : prev[selectedElement] + step
    }))
  }

  const getElementStyle = (elementType: ElementType) => {
    const offset = elementOffsets[elementType]
    return {
      transform: `translateY(${offset}px)`,
      transition: 'transform 0.2s ease-in-out'
    }
  }

  const getAvailableElements = (): ElementType[] => {
    const elements: ElementType[] = ['title']
    if (subtitle) elements.push('subtitle')
    if (bullets && bullets.length > 0) elements.push('bullets')
    if (quotes && quotes.length > 0) elements.push('quotes')
    if (callout) elements.push('callout')
    return elements
  }

  // Function to get the appropriate content image based on slide number
  const getContentImage = () => {
    // Check if a specific slide image exists, otherwise use placeholder
    const slideImagePath = `/slide${slideNumber}.png`
    return slideImagePath
  }

  const availableElements = getAvailableElements()

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Preview Container */}
      <div className="relative">
        <div
          ref={slideRef}
          className="relative overflow-hidden"
          style={{
            width: "1080px",
            height: "1350px",
          }}
        >
          {/* Background Image */}
          <Image src={isFirstSlide ? "/bg1.png" : isLastSlide ? "/bg3.png" : "/bg2.png"} alt="Background" fill className="object-cover" priority />

          {/* Content Areas following layout1.png structure */}
          <div className="absolute inset-0 flex flex-col items-center justify-start px-16 pt-20 pb-8">
            {/* Title Area - Top section */}
            <h1
              className="font-league-gothic uppercase text-black text-center leading-none mb-4 px-8"
              style={{
                fontSize: "116px",
                lineHeight: "0.85",
                ...getElementStyle('title')
              }}
            >
              <ReactMarkdown>{title}</ReactMarkdown>
            </h1>
            {/* Subtitle */}
            {subtitle && (
              <div 
                className="text-black text-center mb-6" 
                style={{ 
                  fontSize: "42px", 
                  lineHeight: "1.2",
                  ...getElementStyle('subtitle')
                }}
              >
                <ReactMarkdown>{subtitle}</ReactMarkdown>
              </div>
            )}
            {/* Bullets */}
            {bullets && bullets.length > 0 && (
              <ul 
                className="text-black text-left mb-6" 
                style={{ 
                  fontSize: "32px", 
                  lineHeight: "1.4",
                  ...getElementStyle('bullets')
                }}
              >
                {bullets.map((item, index) => (
                  <li key={index} className="mb-2">
                    <ReactMarkdown components={{p: 'span'}}>{item}</ReactMarkdown>
                  </li>
                ))}
              </ul>
            )}
            {/* Quotes */}
            {quotes && quotes.length > 0 && (
              <div 
                className="text-black text-center mb-6" 
                style={{ 
                  fontSize: "36px", 
                  lineHeight: "1.3",
                  ...getElementStyle('quotes')
                }}
              >
                {quotes.map((quote, index) => (
                  <div key={index} className="mb-3 italic">
                    <ReactMarkdown>{quote}</ReactMarkdown>
                  </div>
                ))}
              </div>
            )}
            {/* Callout */}
            {callout && (
              <div 
                className="text-black text-center font-bold italic mt-8" 
                style={{ 
                  fontSize: "48px", 
                  lineHeight: "1.2",
                  ...getElementStyle('callout')
                }}
              >
                <ReactMarkdown>{callout}</ReactMarkdown>
              </div>
            )}
            {/* Image Area - Bottom section */}
            <div className="flex-1 flex items-center justify-center w-full">
              <Image
                src={getContentImage()}
                alt={`Slide ${slideNumber} content`}
                width={600}
                height={400}
                className="object-cover rounded-lg"
                onError={(e) => {
                  // Fall back to placeholder if slide image doesn't exist
                  const target = e.target as HTMLImageElement
                  target.src = `/placeholder.svg?height=400&width=600&query=slide-${slideNumber}-content`
                }}
              />
            </div>
          </div>
        </div>

        {/* Universal Positioning Tool */}
        {availableElements.length > 1 && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg border p-3 flex flex-col gap-2 min-w-[120px]">
            <div className="text-xs font-medium text-gray-700 mb-1">Position Tool</div>
            
            <Select value={selectedElement} onValueChange={(value) => setSelectedElement(value as ElementType)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableElements.map((element) => (
                  <SelectItem key={element} value={element} className="text-xs">
                    {element.charAt(0).toUpperCase() + element.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-col gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleElementMove('up')}
                className="h-8 w-full p-0"
              >
                <ChevronUp size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleElementMove('down')}
                className="h-8 w-full p-0"
              >
                <ChevronDown size={16} />
              </Button>
            </div>

            <div className="text-xs text-center text-gray-400 border-t pt-1">
              {elementOffsets[selectedElement]}px
            </div>
          </div>
        )}
      </div>
    </div>
  )
})
