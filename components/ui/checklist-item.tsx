import React from 'react'

interface ChecklistItemProps {
  type: 'check' | 'cross' | 'rotate' | 'number'
  text: string
  index?: number // for numbered items
  fontSize?: number
  lineSpacing?: number
}

export function ChecklistItem({ 
  type, 
  text, 
  index = 1, 
  fontSize = 35, 
  lineSpacing = 1.2 
}: ChecklistItemProps) {
  const renderIcon = () => {
    switch (type) {
      case 'check':
        return (
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">✓</span>
          </div>
        )
      case 'cross':
        return (
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">✗</span>
          </div>
        )
      case 'rotate':
        return (
          <span className="text-2xl flex-shrink-0">🔁</span>
        )
      case 'number':
        return (
          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xl">{index}</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex items-center space-x-4">
      {renderIcon()}
      <span 
        className="text-black font-medium"
        style={{ 
          fontFamily: "var(--font-architects-daughter), 'Architects Daughter', cursive",
          fontSize: `${fontSize}px`,
          lineHeight: lineSpacing
        }}
      >
        {text.split('|').map((line, lineIndex) => (
          <span key={lineIndex}>
            {line}
            {lineIndex < text.split('|').length - 1 && <br />}
          </span>
        ))}
      </span>
    </div>
  )
}
