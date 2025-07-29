"use client"

import { useState } from "react"
import { Settings as SettingsIcon, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeSelector } from "./theme-selector"
import { ThemeEditor } from "./theme-editor"
import { Theme } from "@/lib/themes"
import { getTranslation } from "@/lib/translations"

interface SettingsProps {
  onBackgroundChange: (type: 'first' | 'middle' | 'last', file: File) => void
  onTextColorChange: (color: string) => void
  onThemeChange: (theme: Theme) => void
  currentTextColor: string
  currentTheme: Theme
  language: 'es' | 'en'
}

export function Settings({ onBackgroundChange, onTextColorChange, onThemeChange, currentTextColor, currentTheme, language }: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const t = getTranslation(language)

  const handleBackgroundUpload = async (type: 'first' | 'middle' | 'last', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    setUploading(type)
    try {
      onBackgroundChange(type, file)
    } catch (error) {
      console.error('Background upload error:', error)
      alert('Failed to upload background image')
    } finally {
      setUploading(null)
    }
  }

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm hover:bg-white"
        >
          <SettingsIcon size={16} className="mr-2" />
          {language === 'es' ? 'Configuración' : 'Settings'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.settings.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Theme Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t.settings.themeManagement}</h3>
            
            <div className="space-y-4">
              <div>
                <Label>{t.settings.currentTheme}</Label>
                <div className="mt-2">
                  <ThemeSelector 
                    onThemeChange={onThemeChange}
                    currentTheme={currentTheme}
                    language={language}
                  />
                </div>
              </div>
              
              <div>
                <Label>{t.settings.createNewTheme}</Label>
                <div className="mt-2">
                  <ThemeEditor 
                    onThemeCreated={onThemeChange}
                    language={language}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Background Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Background Images</h3>
            
            {/* First Slide Background */}
            <div className="space-y-2">
              <Label htmlFor="first-bg">First Slide Background</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="first-bg"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleBackgroundUpload('first', e)}
                  className="flex-1"
                />
                {uploading === 'first' && (
                  <div className="text-sm text-blue-500">Uploading...</div>
                )}
              </div>
              <p className="text-xs text-gray-500">Recommended: 1080x1350px or similar aspect ratio</p>
            </div>

            {/* Middle Slides Background */}
            <div className="space-y-2">
              <Label htmlFor="middle-bg">Middle Slides Background</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="middle-bg"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleBackgroundUpload('middle', e)}
                  className="flex-1"
                />
                {uploading === 'middle' && (
                  <div className="text-sm text-blue-500">Uploading...</div>
                )}
              </div>
              <p className="text-xs text-gray-500">Used for slides 2, 3, 4, etc.</p>
            </div>

            {/* Last Slide Background */}
            <div className="space-y-2">
              <Label htmlFor="last-bg">Last Slide Background</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="last-bg"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleBackgroundUpload('last', e)}
                  className="flex-1"
                />
                {uploading === 'last' && (
                  <div className="text-sm text-blue-500">Uploading...</div>
                )}
              </div>
              <p className="text-xs text-gray-500">Used for the final slide</p>
            </div>
          </div>

          {/* Text Color Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Text Color</h3>
            
            <div className="space-y-2">
              <Label htmlFor="text-color">Text Color</Label>
              <Select value={currentTextColor} onValueChange={onTextColorChange}>
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
              <p className="text-xs text-gray-500">Choose text color that works well with your backgrounds</p>
            </div>
          </div>

          {/* Current Background Preview */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Current Backgrounds</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="w-16 h-20 bg-gray-200 rounded border mx-auto mb-1 flex items-center justify-center text-xs">
                  First
                </div>
                <p className="text-xs text-gray-500">First Slide</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-20 bg-gray-200 rounded border mx-auto mb-1 flex items-center justify-center text-xs">
                  Middle
                </div>
                <p className="text-xs text-gray-500">Middle Slides</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-20 bg-gray-200 rounded border mx-auto mb-1 flex items-center justify-center text-xs">
                  Last
                </div>
                <p className="text-xs text-gray-500">Last Slide</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 