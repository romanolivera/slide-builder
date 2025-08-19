export interface Theme {
  id: string
  name: string
  textColor: string
  backgrounds: {
    first: string
    middle: string
    last: string
  }
  // New properties for enhanced themes
  fonts?: {
    title: string
    subtitle: string
    body: string
  }
  layout?: {
    titleSize: number
    subtitleSize: number
    bodySize: number
    titleSpacing: number
    contentSpacing: number
    imagePosition: 'top' | 'center' | 'bottom'
  }
  isBuiltIn?: boolean
  createdAt: number
}

// Theme storage functions
export function saveCustomTheme(theme: Omit<Theme, 'id' | 'createdAt'>): string {
  const customThemes = getCustomThemes()
  const id = `theme-${Date.now()}`
  const newTheme: Theme = { 
    ...theme, 
    id,
    createdAt: Date.now()
  }
  
  customThemes.push(newTheme)
  localStorage.setItem('custom-themes', JSON.stringify(customThemes))
  
  // Also save as current theme
  saveCurrentTheme(newTheme)
  
  return id
}

export function getCustomThemes(): Theme[] {
  try {
    const stored = localStorage.getItem('custom-themes')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function getAllThemes(): Theme[] {
  const customThemes = getCustomThemes()
  // For now, keep the old hardcoded themes as fallback
  // Later we'll update this to use loadBuiltInThemes()
  const defaultTheme = getDefaultTheme()
  return [defaultTheme, getAltTheme(), getShoeReviewTheme(), ...customThemes]
}

export function deleteCustomTheme(id: string): void {
  const customThemes = getCustomThemes().filter(theme => theme.id !== id)
  localStorage.setItem('custom-themes', JSON.stringify(customThemes))
  
  // If we're deleting the current theme, switch to default
  const currentTheme = getCurrentTheme()
  if (currentTheme && currentTheme.id === id) {
    saveCurrentTheme(getDefaultTheme())
  }
}

export function saveCurrentTheme(theme: Theme): void {
  localStorage.setItem('current-theme', JSON.stringify(theme))
}

export function getCurrentTheme(): Theme | null {
  try {
    const stored = localStorage.getItem('current-theme')
    if (stored) {
      const theme = JSON.parse(stored)
      // Validate that the theme still exists (for custom themes)
      if (theme.id === 'default') {
        return theme
      }
      const customThemes = getCustomThemes()
      const themeExists = customThemes.some(t => t.id === theme.id)
      if (themeExists) {
        return theme
      }
      // If theme doesn't exist anymore, return null to fall back to default
      return null
    }
    return null
  } catch {
    return null
  }
}

export function getDefaultTheme(): Theme {
  return {
    id: 'default',
    name: 'Default',
    textColor: '#000000',
    backgrounds: {
      first: '/themes/default/bg1.png',
      middle: '/themes/default/bg2.png',
      last: '/themes/default/bg3.png'
    },
    fonts: {
      title: 'League Gothic',
      subtitle: 'Inter',
      body: 'Inter'
    },
    layout: {
      titleSize: 116,
      subtitleSize: 42,
      bodySize: 32,
      titleSpacing: 20,
      contentSpacing: 16,
      imagePosition: 'bottom'
    },
    isBuiltIn: true,
    createdAt: 0
  }
}

// Helper function to get the best available theme
export function getBestAvailableTheme(): Theme {
  const currentTheme = getCurrentTheme()
  if (currentTheme) {
    return currentTheme
  }
  return getDefaultTheme()
} 

// Minimal built-in alternate theme with different defaults
export function getAltTheme(): Theme {
  return {
    id: 'alt',
    name: 'Alternate',
    textColor: '#111111',
    backgrounds: {
      first: '/themes/alt-bg1.png',
      middle: '/themes/alt-bg2.png',
      last: '/themes/alt-bg3.png'
    },
    fonts: {
      title: 'League Gothic',
      subtitle: 'Inter',
      body: 'Inter'
    },
    layout: {
      titleSize: 116,
      subtitleSize: 42,
      bodySize: 32,
      titleSpacing: 20,
      contentSpacing: 16,
      imagePosition: 'bottom'
    },
    isBuiltIn: true,
    createdAt: 0
  }
}

// Built-in template theme entry for Shoe Review (uses per-slide backgrounds in its renderer)
export function getShoeReviewTheme(): Theme {
  return {
    id: 'shoe-review',
    name: 'Shoe Review',
    textColor: '#000000',
    // Use first/middle/last just for preview purposes in selector
    backgrounds: {
      first: '/themes/shoe-review/shoe_review-bg1.png',
      middle: '/themes/shoe-review/shoe_review-bg3.png',
      last: '/themes/shoe-review/shoe_review-bg5.png'
    },
    fonts: {
      title: 'League Spartan',
      subtitle: 'Inter',
      body: 'Inter'
    },
    layout: {
      titleSize: 100,
      subtitleSize: 36,
      bodySize: 28,
      titleSpacing: 24,
      contentSpacing: 20,
      imagePosition: 'center'
    },
    isBuiltIn: true,
    createdAt: 0
  }
}

// New function to load themes from folder structure
export async function loadBuiltInThemes(): Promise<Theme[]> {
  try {
    // List of theme folders to load
    const themeFolders = [
      'default',
      'modern'
      // Add new theme names here when you create them
    ]
    
    const themes: Theme[] = []
    
    for (const folder of themeFolders) {
      try {
        const response = await fetch(`/themes/${folder}/config.json`)
        if (response.ok) {
          const theme = await response.json()
          themes.push(theme)
        }
      } catch (error) {
        console.warn(`Failed to load theme ${folder}:`, error)
      }
    }
    
    return themes
  } catch (error) {
    console.error('Failed to load built-in themes:', error)
    // Fallback to hardcoded themes
    return [getDefaultTheme(), getAltTheme()]
  }
}