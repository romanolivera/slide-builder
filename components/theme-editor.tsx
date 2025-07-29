"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Upload, X } from "lucide-react"
import { Theme, saveCustomTheme } from "@/lib/themes"
import { getTranslation } from "@/lib/translations"

interface ThemeEditorProps {
  onThemeCreated: (theme: Theme) => void
  language: 'es' | 'en'
}

export function ThemeEditor({ onThemeCreated, language }: ThemeEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [themeName, setThemeName] = useState("")
  const [textColor, setTextColor] = useState("#000000")
  const [backgrounds, setBackgrounds] = useState({
    first: null as File | null,
    middle: null as File | null,
    last: null as File | null
  })
  const [uploading, setUploading] = useState<string | null>(null)
  const t = getTranslation(language)

  const textColorOptions = [
    { value: '#000000', label: 'Black' },
    { value: '#FFFFFF', label: 'White' },
    { value: '#FF0000', label: 'Red' },
    { value: '#00FF00', label: 'Green' },
    { value: '#0000FF', label: 'Blue' },
    { value: '#FFFF00', label: 'Yellow' },
    { value: '#FF00FF', label: 'Magenta' },
    { value: '#00FFFF', label: 'Cyan' },
    { value: '#FFA500', label: 'Orange' },
    { value: '#800080', label: 'Purple' },
  ]

  const handleBackgroundUpload = async (type: 'first' | 'middle' | 'last', file: File) => {
    setUploading(type)
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('backgroundType', type)
      // Generate a temporary theme ID for upload
      const tempThemeId = `temp-${Date.now()}`

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
      
      const response = await fetch('/api/upload-theme-background', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Upload failed: ${response.status} ${errorText}`)
      }

      const result = await response.json()
      if (result.success) {
        setBackgrounds(prev => ({
          ...prev,
          [type]: file
        }))
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Background upload error:', error)
      alert(`Failed to upload background image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(null)
    }
  }

  const handleFileChange = (type: 'first' | 'middle' | 'last', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Create a copy of the file to avoid issues with file object reuse
    const fileCopy = new File([file], file.name, { type: file.type })
    
    handleBackgroundUpload(type, fileCopy)
  }

  const handleCreateTheme = async () => {
    if (!themeName.trim()) {
      alert('Please enter a theme name')
      return
    }

    if (!backgrounds.first || !backgrounds.middle || !backgrounds.last) {
      alert('Please upload all three background images')
      return
    }

    setIsCreating(true)
    try {
      // Create a temporary theme ID for upload
      const uploadThemeId = `theme-${Date.now()}`
      
      // Upload all backgrounds with the temporary theme ID
      const backgroundUrls: { [key: string]: string } = {}
      
      // Create a new array of upload promises to handle them properly
      const uploadPromises = [
        { type: 'first', file: backgrounds.first },
        { type: 'middle', file: backgrounds.middle },
        { type: 'last', file: backgrounds.last }
      ].map(async ({ type, file }) => {
        if (!file) return

        try {
          const formData = new FormData()
          formData.append('image', file)
          formData.append('backgroundType', type)
          formData.append('themeId', uploadThemeId)

          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
          
          const response = await fetch('/api/upload-theme-background', {
            method: 'POST',
            body: formData,
            signal: controller.signal
          })
          
          clearTimeout(timeoutId)

          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Failed to upload ${type} background: ${response.status} ${errorText}`)
          }

          const result = await response.json()
          if (!result.success) {
            throw new Error(`Upload failed for ${type}: ${result.error || 'Unknown error'}`)
          }

          return { type, url: result.url }
        } catch (error) {
          console.error(`Error uploading ${type} background:`, error)
          throw new Error(`Failed to upload ${type} background: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      })

      // Wait for all uploads to complete
      const results = await Promise.all(uploadPromises)
      
      // Build background URLs object
      results.forEach(result => {
        if (result) {
          backgroundUrls[result.type] = result.url
        }
      })

      // Verify all uploads succeeded
      if (!backgroundUrls.first || !backgroundUrls.middle || !backgroundUrls.last) {
        throw new Error('Some background uploads failed')
      }

      // Create and save the theme with permanent background URLs
      const newTheme = {
        name: themeName.trim(),
        textColor,
        backgrounds: {
          first: backgroundUrls.first,
          middle: backgroundUrls.middle,
          last: backgroundUrls.last
        }
      }

      const themeId = saveCustomTheme(newTheme)
      const createdTheme: Theme = {
        ...newTheme,
        id: themeId,
        createdAt: Date.now()
      }

      onThemeCreated(createdTheme)
      setIsOpen(false)
      resetForm()
    } catch (error) {
      console.error('Theme creation error:', error)
      alert(`Failed to create theme: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsCreating(false)
    }
  }

  const resetForm = () => {
    setThemeName("")
    setTextColor("#000000")
    setBackgrounds({
      first: null,
      middle: null,
      last: null
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                   <DialogTrigger asChild>
               <Button variant="outline" size="sm" className="flex items-center gap-2">
                 <Plus size={16} />
                 {t.themeEditor.addTheme}
               </Button>
             </DialogTrigger>
                   <DialogContent className="sm:max-w-[600px]">
               <DialogHeader>
                 <DialogTitle>{t.themeEditor.title}</DialogTitle>
               </DialogHeader>
        
        <div className="space-y-6">
                           {/* Theme Name */}
                 <div className="space-y-2">
                   <Label htmlFor="theme-name">{t.themeEditor.themeName}</Label>
                   <Input
                     id="theme-name"
                     value={themeName}
                     onChange={(e) => setThemeName(e.target.value)}
                     placeholder={t.themeEditor.themeNamePlaceholder}
                   />
                 </div>

                           {/* Text Color */}
                 <div className="space-y-2">
                   <Label htmlFor="text-color">{t.themeEditor.textColor}</Label>
                   <Select value={textColor} onValueChange={setTextColor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {textColorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: option.value }}
                      />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

                           {/* Background Images */}
                 <div className="space-y-4">
                   <Label>{t.themeEditor.backgroundImages}</Label>
                   <p className="text-sm text-gray-500">{t.themeEditor.backgroundImagesHelp}</p>
            
            <div className="grid grid-cols-1 gap-4">
                                   {/* First Slide Background */}
                     <div className="space-y-2">
                       <Label htmlFor="first-bg">{t.themeEditor.firstSlideBackground}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="first-bg"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('first', e)}
                    className="flex-1"
                  />
                                           {uploading === 'first' && (
                           <div className="text-sm text-blue-500">{t.themeEditor.uploading}</div>
                         )}
                  {backgrounds.first && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setBackgrounds(prev => ({ ...prev, first: null }))}
                    >
                      <X size={14} />
                    </Button>
                  )}
                </div>
                                       {backgrounds.first && (
                         <p className="text-xs text-green-500">{t.themeEditor.firstBackgroundUploaded}</p>
                       )}
              </div>

                                   {/* Middle Slides Background */}
                     <div className="space-y-2">
                       <Label htmlFor="middle-bg">{t.themeEditor.middleSlidesBackground}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="middle-bg"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('middle', e)}
                    className="flex-1"
                  />
                                           {uploading === 'middle' && (
                           <div className="text-sm text-blue-500">{t.themeEditor.uploading}</div>
                         )}
                  {backgrounds.middle && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setBackgrounds(prev => ({ ...prev, middle: null }))}
                    >
                      <X size={14} />
                    </Button>
                  )}
                </div>
                                       {backgrounds.middle && (
                         <p className="text-xs text-green-500">{t.themeEditor.middleBackgroundUploaded}</p>
                       )}
              </div>

                                   {/* Last Slide Background */}
                     <div className="space-y-2">
                       <Label htmlFor="last-bg">{t.themeEditor.lastSlideBackground}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="last-bg"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('last', e)}
                    className="flex-1"
                  />
                                           {uploading === 'last' && (
                           <div className="text-sm text-blue-500">{t.themeEditor.uploading}</div>
                         )}
                  {backgrounds.last && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setBackgrounds(prev => ({ ...prev, last: null }))}
                    >
                      <X size={14} />
                    </Button>
                  )}
                </div>
                                       {backgrounds.last && (
                         <p className="text-xs text-green-500">{t.themeEditor.lastBackgroundUploaded}</p>
                       )}
              </div>
            </div>
          </div>

                           {/* Create Button */}
                 <div className="flex justify-end gap-2">
                   <Button variant="outline" onClick={() => setIsOpen(false)}>
                     {t.themeEditor.cancel}
                   </Button>
                   <Button 
                     onClick={handleCreateTheme}
                     disabled={isCreating || !themeName.trim() || !backgrounds.first || !backgrounds.middle || !backgrounds.last}
                   >
                     {isCreating ? t.themeEditor.creating : t.themeEditor.createTheme}
                   </Button>
                 </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 