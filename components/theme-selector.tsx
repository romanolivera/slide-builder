"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Theme, getAllThemes, saveCurrentTheme, deleteCustomTheme, getDefaultTheme } from "@/lib/themes"
import { Palette, Trash2, Check } from "lucide-react"
import { getTranslation } from "@/lib/translations"

interface ThemeSelectorProps {
  onThemeChange: (theme: Theme) => void
  currentTheme: Theme
  language: 'es' | 'en'
}

export function ThemeSelector({ onThemeChange, currentTheme, language }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const themes = getAllThemes()
  const t = getTranslation(language)

  const handleThemeSelect = (theme: Theme) => {
    onThemeChange(theme)
    saveCurrentTheme(theme)
    setIsOpen(false)
  }

  const handleDeleteTheme = (themeId: string) => {
    if (confirm('Are you sure you want to delete this theme?')) {
      deleteCustomTheme(themeId)
      // If we're deleting the current theme, switch to default
      if (themeId === currentTheme.id) {
        const defaultTheme = getDefaultTheme()
        onThemeChange(defaultTheme)
        saveCurrentTheme(defaultTheme)
      }
      // Force re-render
      window.location.reload()
    }
  }

          if (themes.length === 0) {
          return (
            <div className="text-center p-4">
              <Palette className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">{t.themeSelector.noThemesCreated}</p>
              <p className="text-xs text-gray-400">{t.themeSelector.noThemesCreatedHelp}</p>
            </div>
          )
        }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Palette size={16} />
          {currentTheme.name}
        </Button>
      </DialogTrigger>
                   <DialogContent className="sm:max-w-[600px]">
               <DialogHeader>
                 <DialogTitle>{t.themeSelector.title}</DialogTitle>
               </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  currentTheme.id === theme.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleThemeSelect(theme)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{theme.name}</h3>
                    {currentTheme.id === theme.id && (
                      <Check size={16} className="text-blue-500" />
                    )}
                  </div>
                  {theme.id !== 'default' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteTheme(theme.id)
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
                
                {/* Theme Preview */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: theme.textColor }}
                    />
                    <span className="text-xs">Text Color</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-1">
                    <div className="text-center">
                      <div className="w-8 h-10 bg-gray-200 rounded border mx-auto mb-1 flex items-center justify-center text-xs">
                        1st
                      </div>
                      <p className="text-xs text-gray-500">First</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-10 bg-gray-200 rounded border mx-auto mb-1 flex items-center justify-center text-xs">
                        Mid
                      </div>
                      <p className="text-xs text-gray-500">Middle</p>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-10 bg-gray-200 rounded border mx-auto mb-1 flex items-center justify-center text-xs">
                        Last
                      </div>
                      <p className="text-xs text-gray-500">Last</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
                           <div className="text-xs text-gray-500">
                   {t.themeSelector.clickToSelect}
                 </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 