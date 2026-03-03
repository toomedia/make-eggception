'use client';

import React from 'react';
import { trackAndRedirect } from '@/lib/egg-analytics';
import { appendAttributionToUrl } from '@/lib/egg-analytics/attribution';
import { EXTERNAL_URLS } from '@/lib/egg-analytics/ctas';
import { useLanguage } from '@/lib/LanguageContext';
import { useTheme } from '@/lib/ThemeContext';

function isModifiedClick(e: React.MouseEvent<HTMLAnchorElement>): boolean {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
}

export default function MakeNavigation() {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = language === 'de' ? 'en' : 'de';
    setLanguage(newLang);
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${
        theme === 'dark'
          ? 'bg-[var(--bg-primary)]/80 border-b border-black'
          : 'bg-[var(--bg-secondary)]/80 border-b border-white'
      } backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href={appendAttributionToUrl(EXTERNAL_URLS.home)}
          onClick={(e) => {
            if (isModifiedClick(e)) return;
            e.preventDefault();
            trackAndRedirect({ cta_id: 'nav_home', href: EXTERNAL_URLS.home, position: 'nav', delayMs: 120 });
          }}
          className={`text-2xl font-bold hover:text-[var(--accent-primary)] transition-colors ${
            theme === 'dark' ? 'text-white' : 'text-[var(--text-primary)]'
          }`}
        >
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
