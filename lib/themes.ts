export interface Theme {
  id: string
  name: string
  textColor: string
  backgrounds: {
    first: string
    middle: string
    last: string
  }
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
  const defaultTheme = getDefaultTheme()
  return [defaultTheme, ...customThemes]
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
      first: '/bg1.png',
      middle: '/bg2.png',
      last: '/bg3.png'
    },
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