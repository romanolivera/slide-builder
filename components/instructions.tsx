"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, CheckCircle, Image, Download, Settings, Palette, Zap } from "lucide-react"

interface InstructionsProps {
  language: 'es' | 'en'
}

export function Instructions({ language }: InstructionsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const content = {
    es: {
      title: "Cómo usar el Shoe Review Template",
      subtitle: "Guía específica para crear slides de reseñas de zapatillas deportivas",
      steps: [
        {
          title: "1. Escribe tu contenido en Markdown",
          description: "En el panel izquierdo, escribe tu contenido usando Markdown. Cada slide debe empezar con '## Título' y separar slides con '---'.",
          example: `## Adizero Adios | Pro 4
- $$$$

---

## Características principales
- Peso: 180g
- Drop: 8mm
- Suela: Carbón`,
          icon: "📝"
        },
        {
          title: "2. Sistema de Precio con Escala",
          description: "Para el primer slide, usa una viñeta con solo símbolos '$' para indicar el nivel de precio (1-5). Los símbolos se mostrarán en verde, el resto en gris.",
          example: `## Adizero Adios | Pro 4
- $$$$  ← Esto mostrará 4 símbolos verdes y 1 gris`,
          tips: [
            "Escribe solo símbolos '$' (1-5 máximo)",
            "Los símbolos se renderizan como escala visual",
            "Perfecto para indicar precio relativo sin números exactos"
          ],
          icon: "💰"
        },
        {
          title: "3. Agrega la imagen de la zapatilla",
          description: "Debajo del preview del slide, haz clic en el área de imagen para subir la foto de la zapatilla. Aparecerá centrada en el slide.",
          tips: [
            "Acepta cualquier formato de imagen (JPG, PNG, WebP, etc.)",
            "Se convierte automáticamente a PNG",
            "Se ajusta automáticamente al área de la zapatilla"
          ],
          icon: "🖼️"
        },
        {
          title: "4. Personaliza la posición y tamaño",
          description: "Usa las herramientas de posicionamiento para ajustar la zapatilla, título y escala de precio. También puedes cambiar el tamaño de fuente y espaciado del título.",
          tips: [
            "Herramienta de posición: mueve elementos arriba/abajo",
            "Control de zoom: ajusta el tamaño de la imagen",
            "Editor de fuente: cambia tamaño y espaciado del título"
          ],
          icon: "⚙️"
        },
        {
          title: "5. Descarga tu slide",
          description: "Usa el botón de descarga para exportar tu slide como PNG de alta calidad.",
          tips: [
            "Se descarga como PNG de 1080x1350px",
            "Mantiene todas las personalizaciones",
            "Perfecto para redes sociales y presentaciones"
          ],
          icon: "⬇️"
        }
      ],
      tips: {
        title: "Consejos específicos para Shoe Review:",
        items: [
          "El primer slide es el principal (imagen + título + precio)",
          "Usa '|' en el título para saltos de línea automáticos",
          "La escala de precio va de 1 a 5 símbolos '$'",
          "Las imágenes se centran automáticamente",
          "Los fondos cambian según el número de slide",
          "Perfecto para Instagram, TikTok y reviews"
        ]
      }
    },
    en: {
      title: "How to use the Shoe Review Template",
      subtitle: "Specific guide for creating athletic shoe review slides",
      steps: [
        {
          title: "1. Write your content in Markdown",
          description: "In the left panel, write your content using Markdown. Each slide should start with '## Title' and separate slides with '---'.",
          example: `## Adizero Adios | Pro 4
- $$$$

---

## Key Features
- Weight: 180g
- Drop: 8mm
- Sole: Carbon`,
          icon: "📝"
        },
        {
          title: "2. Price Scale System",
          description: "For the first slide, use a bullet with only '$' symbols to indicate the price level (1-5). The symbols will show in green, the rest in gray.",
          example: `## Adizero Adios | Pro 4
- $$$$  ← This will show 4 green symbols and 1 gray`,
          tips: [
            "Write only '$' symbols (1-5 maximum)",
            "Symbols render as visual scale",
            "Perfect for indicating relative price without exact numbers"
          ],
          icon: "💰"
        },
        {
          title: "3. Add the shoe image",
          description: "Below the slide preview, click on the image area to upload the shoe photo. It will appear centered in the slide.",
          tips: [
            "Accepts any image format (JPG, PNG, WebP, etc.)",
            "Automatically converts to PNG",
            "Automatically fits the shoe area"
          ],
          icon: "🖼️"
        },
        {
          title: "4. Customize position and size",
          description: "Use the positioning tools to adjust the shoe, title, and price scale. You can also change the title font size and line spacing.",
          tips: [
            "Position tool: move elements up/down",
            "Zoom control: adjust image size",
            "Font editor: change title size and spacing"
          ],
          icon: "⚙️"
        },
        {
          title: "5. Download your slide",
          description: "Use the download button to export your slide as a high-quality PNG.",
          tips: [
            "Downloads as 1080x1350px PNG",
            "Maintains all customizations",
            "Perfect for social media and presentations"
          ],
          icon: "⬇️"
        }
      ],
      tips: {
        title: "Shoe Review specific tips:",
        items: [
          "First slide is the main one (image + title + price)",
          "Use '|' in title for automatic line breaks",
          "Price scale goes from 1 to 5 '$' symbols",
          "Images center automatically",
          "Backgrounds change based on slide number",
          "Perfect for Instagram, TikTok and reviews"
        ]
      }
    }
  }

  const currentContent = content[language]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <HelpCircle size={16} />
          {language === 'es' ? 'Instrucciones' : 'Instructions'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap size={20} />
            {currentContent.title}
          </DialogTitle>
          <p className="text-sm text-gray-600">{currentContent.subtitle}</p>
        </DialogHeader>
        
        <div className="space-y-6">
          {currentContent.steps.map((step, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{step.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{step.title}</h3>
                  <p className="text-gray-600 mt-1">{step.description}</p>
                  
                  {step.example && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        {language === 'es' ? 'Ejemplo:' : 'Example:'}
                      </p>
                      <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                        <code>{step.example}</code>
                      </pre>
                    </div>
                  )}
                  
                  {step.tips && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        {language === 'es' ? 'Consejos:' : 'Tips:'}
                      </p>
                      <ul className="space-y-1">
                        {step.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="text-sm text-gray-600 flex items-start gap-2">
                            <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">{currentContent.tips.title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentContent.tips.items.map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 