'use client'

import { LanguageProvider } from '@/lib/LanguageContext'
import { ThemeProvider } from '@/lib/ThemeContext'
import { AnalyticsBootstrap } from '@/components/AnalyticsBootstrap'
import ConsentBanner from '@/components/ConsentBanner'
import { ConsentProvider } from '@/components/ConsentContext'
import MakeNavigation from '@/components/MakeNavigation'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnalyticsBootstrap app="make" variant="funnel_a" />
      <LanguageProvider>
        <ThemeProvider>
          <ConsentProvider>
            <ConsentBanner />
            <MakeNavigation />
            {children}
          </ConsentProvider>
        </ThemeProvider>
      </LanguageProvider>
    </>
  )
}
