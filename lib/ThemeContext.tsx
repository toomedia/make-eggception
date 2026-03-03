'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function readThemeCookie(): Theme | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|; )theme=([^;]+)/)
  const value = match?.[1]
  if (value === 'dark' || value === 'light') return value
  return null
}

function writeThemeCookie(newTheme: Theme) {
  if (typeof document === 'undefined') return
  const isEggceptionDomain =
    typeof window !== 'undefined' &&
    window.location.hostname.endsWith('eggception.club')

  document.cookie = [
    `theme=${newTheme}`,
    'Path=/',
    'Max-Age=31536000',
    'SameSite=Lax',
    'Secure',
    isEggceptionDomain ? 'Domain=.eggception.club' : ''
  ]
    .filter(Boolean)
    .join('; ')
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // 1) cookie (cross-subdomain)
    const cookieTheme = readThemeCookie()
    if (cookieTheme) {
      setThemeState(cookieTheme)
      document.documentElement.setAttribute('data-theme', cookieTheme)
      localStorage.setItem('theme', cookieTheme)
      return
    }

    // 2) localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setThemeState(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
      return
    }

    // 3) system preference
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
    const initialTheme: Theme = prefersLight ? 'light' : 'dark'
    setThemeState(initialTheme)
    document.documentElement.setAttribute('data-theme', initialTheme)
    localStorage.setItem('theme', initialTheme)
    writeThemeCookie(initialTheme)
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    writeThemeCookie(newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  if (!mounted) return null

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
