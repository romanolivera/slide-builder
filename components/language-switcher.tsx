"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"

interface LanguageSwitcherProps {
  language: 'es' | 'en'
  onLanguageChange: (language: 'es' | 'en') => void
}

export function LanguageSwitcher({ language, onLanguageChange }: LanguageSwitcherProps) {
  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ]

  return (
    <div className="flex items-center gap-2">
      <Globe size={16} className="text-gray-500" />
      <Select value={language} onValueChange={(value: 'es' | 'en') => onLanguageChange(value)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 