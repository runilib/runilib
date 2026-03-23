import { useState, useEffect } from 'react'
import { darkTheme, lightTheme } from '../theme'
import type { AppTheme } from '../types'

export function useTheme(): {
  theme:  AppTheme
  isDark: boolean
  toggle: () => void
} {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('runilib-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    localStorage.setItem('runilib-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return {
    theme:  isDark ? darkTheme : lightTheme,
    isDark,
    toggle: () => setIsDark(p => !p),
  }
}
