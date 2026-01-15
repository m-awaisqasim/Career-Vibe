'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

interface ThemeSelectorProps {
  currentTheme: string
  onThemeChange: (theme: string) => void
}

const themes = [
  {
    id: 'modern',
    name: 'Modern Violet',
    description: 'Clean and professional with violet accents',
    preview: 'bg-gradient-to-br from-violet-500 to-purple-600'
  },
  {
    id: 'elegant',
    name: 'Elegant Amber',
    description: 'Warm and sophisticated with amber tones',
    preview: 'bg-gradient-to-br from-amber-500 to-orange-600'
  },
  {
    id: 'minimal',
    name: 'Minimal Slate',
    description: 'Simple and understated with slate colors',
    preview: 'bg-gradient-to-br from-slate-600 to-slate-800'
  },
  {
    id: 'vibrant',
    name: 'Vibrant Pink',
    description: 'Bold and energetic with pink gradients',
    preview: 'bg-gradient-to-br from-pink-500 to-violet-600'
  }
]

export default function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Your Theme</CardTitle>
        <CardDescription>Select a color scheme for your portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className="relative p-4 border-2 rounded-xl transition-all hover:scale-105 hover:shadow-lg"
              style={{
                borderColor: currentTheme === theme.id ? 'currentColor' : 'hsl(var(--border))',
                backgroundColor: currentTheme === theme.id ? 'hsl(var(--accent))' : 'transparent'
              }}
            >
              {currentTheme === theme.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                    <Check className="w-4 h-4 text-violet-600" />
                  </div>
                </div>
              )}
              <div className="space-y-3">
                <div className={`h-20 rounded-lg ${theme.preview}`} />
                <div className="text-left">
                  <h3 className="font-semibold text-sm">{theme.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{theme.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
