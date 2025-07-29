"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, CheckCircle, Image, Download, Settings, Palette } from "lucide-react"

interface InstructionsProps {
  language: 'es' | 'en'
}

export function Instructions({ language }: InstructionsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const content = {
    es: {
      title: "Cómo usar el Slide Builder",
      subtitle: "Guía paso a paso para crear presentaciones profesionales",
      steps: [
        {
          title: "1. Escribe tu contenido en Markdown",
          description: "En el panel izquierdo, escribe tu contenido usando Markdown. Cada slide debe empezar con '## Título' y separar slides con '---'.",
          example: `## Mi primer slide
Este es el contenido de mi slide
- Punto 1
- Punto 2

---

## Mi segundo slide
> Una cita importante
- Más puntos`,
          icon: "📝"
        },
        {
          title: "2. Agrega imágenes a tus slides",
          description: "Debajo de cada preview de slide, haz clic en el área de imagen para subir una foto. La imagen aparecerá automáticamente en el slide.",
          tips: [
            "Acepta cualquier formato de imagen (JPG, PNG, WebP, etc.)",
            "Se convierte automáticamente a PNG",
            "Se redimensiona para ajustarse al slide"
          ],
          icon: "🖼️"
        },
        {
          title: "3. Personaliza el tema",
          description: "Haz clic en 'Settings' (⚙️) en la esquina superior derecha para personalizar colores y fondos.",
          tips: [
            "Crea temas personalizados con 3 fondos diferentes",
            "Cambia el color del texto",
            "Guarda y reutiliza tus temas favoritos"
          ],
          icon: "🎨"
        },
        {
          title: "4. Descarga tus slides",
          description: "Descarga slides individuales o todos a la vez usando los botones de descarga.",
          tips: [
            "Cada slide se descarga como PNG de alta calidad",
            "Usa 'Download All' para descargar toda la presentación",
            "Los slides mantienen la proporción 1080x1350px"
          ],
          icon: "⬇️"
        }
      ],
      tips: {
        title: "Consejos útiles:",
        items: [
          "Usa '---' para separar slides",
          "Cada slide debe empezar con '## Título'",
          "Usa '- ' para crear listas con viñetas",
          "Usa '> ' para crear citas destacadas",
          "Las imágenes son temporales (se pierden al recargar)",
          "Los temas se guardan en tu navegador"
        ]
      }
    },
    en: {
      title: "How to use the Slide Builder",
      subtitle: "Step-by-step guide to create professional presentations",
      steps: [
        {
          title: "1. Write your content in Markdown",
          description: "In the left panel, write your content using Markdown. Each slide should start with '## Title' and separate slides with '---'.",
          example: `## My first slide
This is my slide content
- Point 1
- Point 2

---

## My second slide
> An important quote
- More points`,
          icon: "📝"
        },
        {
          title: "2. Add images to your slides",
          description: "Below each slide preview, click on the image area to upload a photo. The image will automatically appear in the slide.",
          tips: [
            "Accepts any image format (JPG, PNG, WebP, etc.)",
            "Automatically converts to PNG",
            "Resizes to fit the slide"
          ],
          icon: "🖼️"
        },
        {
          title: "3. Customize the theme",
          description: "Click on 'Settings' (⚙️) in the top right corner to customize colors and backgrounds.",
          tips: [
            "Create custom themes with 3 different backgrounds",
            "Change text color",
            "Save and reuse your favorite themes"
          ],
          icon: "🎨"
        },
        {
          title: "4. Download your slides",
          description: "Download individual slides or all at once using the download buttons.",
          tips: [
            "Each slide downloads as high-quality PNG",
            "Use 'Download All' to download the entire presentation",
            "Slides maintain 1080x1350px proportion"
          ],
          icon: "⬇️"
        }
      ],
      tips: {
        title: "Useful tips:",
        items: [
          "Use '---' to separate slides",
          "Each slide should start with '## Title'",
          "Use '- ' to create bullet lists",
          "Use '> ' to create highlighted quotes",
          "Images are temporary (lost on reload)",
          "Themes are saved in your browser"
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
            <HelpCircle size={20} />
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