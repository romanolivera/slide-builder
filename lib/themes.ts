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
  return getCustomThemes()
}

export function deleteCustomTheme(id: string): void {
  const customThemes = getCustomThemes().filter(theme => theme.id !== id)
  localStorage.setItem('custom-themes', JSON.stringify(customThemes))
}

export function saveCurrentTheme(theme: Theme): void {
  localStorage.setItem('current-theme', JSON.stringify(theme))
}

export function getCurrentTheme(): Theme | null {
  try {
    const stored = localStorage.getItem('current-theme')
    return stored ? JSON.parse(stored) : null
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