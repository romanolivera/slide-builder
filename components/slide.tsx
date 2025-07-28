"use client"

import { useRef } from "react"
import Image from "next/image"
import { Download } from "lucide-react"
import { toPng } from "html-to-image"
import { Button } from "@/components/ui/button"
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

export function Slide({ slide }: SlideProps) {
  const { title, subtitle, bullets, quotes, callout, slideNumber, isFirstSlide, isLastSlide } = slide
  const slideRef = useRef<HTMLDivElement>(null)

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

  // Function to get the appropriate content image based on slide number
  const getContentImage = () => {
    // Check if a specific slide image exists, otherwise use placeholder
    const slideImagePath = `/slide${slideNumber}.png`
    return slideImagePath
  }

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
              }}
            >
              <ReactMarkdown>{title}</ReactMarkdown>
            </h1>
            {/* Subtitle */}
            {subtitle && (
              <div className="text-black text-center mb-6" style={{ fontSize: "42px", lineHeight: "1.2" }}>
                <ReactMarkdown>{subtitle}</ReactMarkdown>
              </div>
            )}
            {/* Bullets */}
            {bullets && bullets.length > 0 && (
              <ul className="text-black text-left mb-6" style={{ fontSize: "32px", lineHeight: "1.4" }}>
                {bullets.map((item, index) => (
                  <li key={index} className="mb-2">
                    <ReactMarkdown components={{p: 'span'}}>{item}</ReactMarkdown>
                  </li>
                ))}
              </ul>
            )}
            {/* Quotes */}
            {quotes && quotes.length > 0 && (
              <div className="text-black text-center mb-6" style={{ fontSize: "36px", lineHeight: "1.3" }}>
                {quotes.map((quote, index) => (
                  <div key={index} className="mb-3 italic">
                    <ReactMarkdown>{quote}</ReactMarkdown>
                  </div>
                ))}
              </div>
            )}
            {/* Callout */}
            {callout && (
              <div className="text-black text-center font-bold italic mt-8" style={{ fontSize: "48px", lineHeight: "1.2" }}>
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
      </div>
      {/* Download Button */}
      <Button onClick={handleDownload} className="flex items-center gap-2">
        <Download size={16} />
        Download Slide {slideNumber}
      </Button>
    </div>
  )
}
