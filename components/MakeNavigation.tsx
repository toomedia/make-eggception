'use client';

import React from 'react';
import { track, trackAndRedirect } from '@/lib/egg-analytics';
import { appendAttributionToUrl, sanitizeDestination } from '@/lib/egg-analytics/attribution';
import { EXTERNAL_URLS, type CtaId } from '@/lib/egg-analytics/ctas';
import { useLanguage } from '@/lib/LanguageContext';
import { useTheme } from '@/lib/ThemeContext';

export default function MakeNavigation() {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const handleOutboundClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    ctaId: CtaId,
    destination: string
  ) => {
    const isPlainLeftClick =
      e.button === 0 &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey;

    if (!isPlainLeftClick) {
      track(
        'cta_click',
        {
          cta_id: ctaId,
          destination: sanitizeDestination(destination),
          position: 'nav',
        } as any
      );
      return;
    }

    e.preventDefault();
    trackAndRedirect({ cta_id: ctaId, href: destination, position: 'nav', delayMs: 120 });
  };

  const toggleLanguage = () => {
    const newLang = language === 'de' ? 'en' : 'de';
    setLanguage(newLang);
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-surface border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <a
          href={appendAttributionToUrl(EXTERNAL_URLS.home)}
          onClick={(e) => handleOutboundClick(e, 'nav_logo', EXTERNAL_URLS.home)}
          className="text-2xl font-bold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors flex items-center"
        >
      <img
            src="/logo.png"
            alt="Eggception mascot with orange sunglasses"
            className="h-13 flex-shrink-0 object-contain drop-shadow-md"
            width={50}
            height={50}
          />
          Eggception
        </a>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <button
              onClick={handleThemeToggle}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-colors focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:outline-none"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-colors focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:outline-none"
              aria-label={`Switch to ${language === 'de' ? 'English' : 'German'}`}
            >
              <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
              <span className="font-semibold text-sm text-[var(--text-primary)]">{language.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
