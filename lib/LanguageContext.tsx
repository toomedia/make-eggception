'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, translations, Translations } from './translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function readLangCookie(): Language | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|; )lang=([^;]+)/)
  const value = match?.[1]
  return value === 'de' || value === 'en' ? value : null
}

function writeLangCookie(lang: Language) {
  if (typeof document === 'undefined') return
  const isEggceptionDomain =
    typeof window !== 'undefined' &&
    window.location.hostname.endsWith('eggception.club')

  document.cookie = [
    `lang=${lang}`,
    'Path=/',
    'Max-Age=31536000',
    'SameSite=Lax',
    'Secure',
    isEggceptionDomain ? 'Domain=.eggception.club' : ''
  ]
    .filter(Boolean)
    .join('; ')
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('de')

  useEffect(() => {
    // 1) Cookie (cross-subdomain)
    const cookieLang = readLangCookie()
    if (cookieLang) {
      setLanguageState(cookieLang)
      document.documentElement.lang = cookieLang
      localStorage.setItem('language', cookieLang)
      return
    }

    // 2) Local storage
    const savedLanguage = localStorage.getItem('language') as Language | null
    if (savedLanguage && (savedLanguage === 'de' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage)
      document.documentElement.lang = savedLanguage
      return
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    document.documentElement.lang = lang
    writeLangCookie(lang)
  }

  const t = translations[language]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
