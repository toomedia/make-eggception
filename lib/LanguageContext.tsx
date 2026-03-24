'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, translations, Translations } from './translations'
import { getUserLanguage, setUserLanguagePreference, syncDocumentLanguage } from './userLanguage'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const resolvedLanguage = getUserLanguage()
    setLanguageState(resolvedLanguage)
    syncDocumentLanguage(resolvedLanguage)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    setUserLanguagePreference(lang)
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
