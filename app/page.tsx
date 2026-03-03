'use client';

import { Sparkles, Workflow, Zap } from 'lucide-react';
import type { MouseEvent } from 'react';
import { Card } from '@/components/ui/card';
import { track, trackAndRedirect } from '@/lib/egg-analytics';
import { appendAttributionToUrl, sanitizeDestination } from '@/lib/egg-analytics/attribution';
import { EXTERNAL_URLS, type CtaId } from '@/lib/egg-analytics/ctas';
import { useLanguage } from '@/lib/LanguageContext';
import { useTheme } from '@/lib/ThemeContext';
import { PrimaryButton } from '@/components/ui/custom-buttons';

export default function Home() {
  const { t: tObj } = useLanguage();
  const { theme } = useTheme();
  const t = (key: string): string => {
    const parts = key.split('.');
    let value: any = tObj;
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  };

  const handleOutboundClick = (
    e: MouseEvent<HTMLAnchorElement>,
    ctaId: CtaId,
    destination: string,
    position: string
  ) => {
    const isPlainLeftClick =
      e.button === 0 &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey;

    if (!isPlainLeftClick) {
      track('cta_click', { cta_id: ctaId, destination: sanitizeDestination(destination), position } as any);
      return;
    }

    e.preventDefault();
    trackAndRedirect({ cta_id: ctaId, href: destination, position, delayMs: 120 });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <picture>
          <source media="(min-width: 1600px)" srcSet="/funal_a.png" />
          <source media="(min-width: 1200px)" srcSet="/funal_a.png" />
          <source media="(min-width: 600px)" srcSet="/funal_a.png" />
          <img
            src="/funal_a.png"
            alt="Eggception Make - Create your own memory cards"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </picture>
        <div className="absolute inset-0 bg-black/40" />
        <div
          className={`absolute inset-0 ${
            theme === 'dark'
              ? 'bg-gradient-to-b from-black/30 via-black/20 to-black/40'
              : 'bg-gradient-to-b from-white/20 via-white/10 to-white/30'
          }`}
        />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-16">
        <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight text-white">
            {t('hero.title').split('your style').length > 1 ? (
              <>
                Like Memory, but in{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#F7931E] font-black animate-pulse [animation-duration:3s]">
                  your
                </span>{' '}
                style.
              </>
            ) : (
              <>
                Wie Memory, nur in{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#F7931E] font-black animate-pulse [animation-duration:3s]">
                  deinem
                </span>{' '}
                Style.
              </>
            )}
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl lg:text-3xl mb-10 sm:mb-12 text-balance leading-relaxed font-medium text-white drop-shadow-lg">
            {t('hero.subtitle')}
          </p>

          <p className="text-lg sm:text-xl md:text-2xl mb-10 sm:mb-12 text-balance leading-relaxed font-medium text-white drop-shadow-lg">
            {t('hero.description')}
          </p>

          <div className="flex flex-col gap-5 items-center mb-10 sm:mb-12 w-full max-w-md mx-auto">
            <PrimaryButton
              type="button"
              onClick={() =>
                trackAndRedirect({
                  cta_id: 'hero_studio',
                  href: EXTERNAL_URLS.studio,
                  position: 'FunnelA_EiGestalten_Click',
                  delayMs: 120,
                })
              }
              className="w-full sm:w-auto min-h-[40px] text-lg sm:text-xl font-bold shadow-2xl focus:ring-4 focus:ring-[var(--accent-primary)]/50 focus:outline-none transform hover:scale-105 transition-transform"
            >
              {t('hero.createEgg')}
            </PrimaryButton>
            <a
              href={appendAttributionToUrl(EXTERNAL_URLS.games)}
              onClick={(e) =>
                handleOutboundClick(e, 'hero_games', EXTERNAL_URLS.games, 'FunnelA_JetztSpielen_Click')
              }
              className={`${
                theme === 'dark' ? 'text-white/90 hover:text-white' : 'text-white hover:text-white'
              } underline underline-offset-4 transition-colors min-h-[48px] flex items-center focus:ring-2 focus:ring-white/50 focus:outline-none rounded px-2 text-lg font-semibold`}
            >
              {t('hero.playNow')}
            </a>
          </div>

          {/* <div className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center">
            <span className="px-7 py-3  backdrop-blur-sm rounded-full text-base border border-[var(--border-color)] font-medium shadow-lg text-white">
              {t('hero.badge1')}
            </span>
            <span className="px-7 py-3  backdrop-blur-sm rounded-full text-base border border-[var(--border-color)] font-medium shadow-lg text-white">
              {t('hero.badge2')}
            </span>
            <span className="px-7 py-3  backdrop-blur-sm rounded-full text-base border border-[var(--border-color)] font-medium shadow-lg text-white">
              {t('hero.badge3')}
            </span>
          </div> */}


<div className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center">
            <span className="px-5 py-3 bg-[var(--card-bg)] backdrop-blur-sm rounded-full text-base sm:text-sm border border-[var(--border-color)] font-medium shadow-lg">
              {t('hero.badge1')}
            </span>
            <span className="px-5 py-3 bg-[var(--card-bg)] backdrop-blur-sm rounded-full text-base sm:text-sm border border-[var(--border-color)] font-medium shadow-lg">
            {t('hero.badge2')}
            </span>
            <span className="px-5 py-3 bg-[var(--card-bg)] backdrop-blur-sm rounded-full text-base sm:text-sm border border-[var(--border-color)] font-medium shadow-lg">
            {t('hero.badge3')}
            </span>
          </div>

        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
          <svg
            className={`w-8 h-8 ${theme === 'dark' ? 'text-white/60' : 'text-white/60'}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      <section id="how-it-works" className="py-12 sm:py-16 md:py-20 px-6 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16 tracking-tight">
            {t('howItWorks.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <Card className="p-8 border-2 hover:border-orange-500/50 transition-all hover:shadow-xl">
              <div className="w-16 h-16 mb-4 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Idee Icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-center">{t('howItWorks.step1Title')}</h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] text-center leading-relaxed">
                {t('howItWorks.step1Description')}
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-green-500/50 transition-all hover:shadow-xl">
              <div className="w-16 h-16 mb-4 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Schlüpfen Icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-center">{t('howItWorks.step2Title')}</h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] text-center leading-relaxed">
                {t('howItWorks.step2Description')}
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-blue-500/50 transition-all hover:shadow-xl">
              <div className="w-16 h-16 mb-4 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Battlen Icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-center">{t('howItWorks.step3Title')}</h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] text-center leading-relaxed">
                {t('howItWorks.step3Description')}
              </p>
            </Card>
          </div>

          <div className="flex flex-col gap-4 items-center w-full max-w-md mx-auto">
            <button
              type="button"
              onClick={() =>
                trackAndRedirect({
                  cta_id: 'steps_studio',
                  href: EXTERNAL_URLS.studio,
                  position: 'FunnelA_EiGestalten_Click',
                  delayMs: 120,
                })
              }
              className="btn-primary w-full sm:w-auto sm:min-w-[200px] min-h-[48px] focus:ring-4 focus:ring-[var(--accent-primary)]/50 focus:outline-none"
            >
              {t('howItWorks.createEgg')}
            </button>
            <a
              href={appendAttributionToUrl(EXTERNAL_URLS.presets)}
              onClick={(e) =>
                handleOutboundClick(e, 'steps_presets', EXTERNAL_URLS.presets, 'FunnelA_Presets_Click')
              }
              className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] underline underline-offset-4 transition-colors min-h-[48px] flex items-center focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:outline-none rounded px-2"
            >
              {t('howItWorks.toPresets')}
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 sm:mb-6 tracking-tight">
            {t('features.title')}
          </h2>
          <p className="text-center text-[var(--text-secondary)] text-sm sm:text-base md:text-lg mb-8 sm:mb-12 md:mb-16 max-w-3xl mx-auto leading-relaxed">
            {t('features.deckExplanation')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="p-8 border-2 hover:border-orange-500/50 transition-all hover:shadow-xl">
              <div className="w-16 h-16 mb-4 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-center">{t('features.click.title')}</h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] text-center leading-relaxed mb-6">
                {t('features.click.description')}
              </p>
              <button
                type="button"
                onClick={() =>
                  trackAndRedirect({
                    cta_id: 'card_studio',
                    href: EXTERNAL_URLS.studio,
                    position: 'FunnelA_EiGestalten_Click',
                    delayMs: 120,
                  })
                }
                className="btn-primary w-full min-h-[48px] focus:ring-4 focus:ring-[var(--accent-primary)]/50 focus:outline-none"
              >
                {t('features.click.cta')}
              </button>
            </Card>

            <Card className="p-8 border-2 hover:border-green-500/50 transition-all hover:shadow-xl">
              <div className="w-16 h-16 mb-4 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                <Workflow className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-center">{t('features.match.title')}</h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] text-center leading-relaxed mb-6">
                {t('features.match.description')}
              </p>
              <button
                type="button"
                onClick={() =>
                  trackAndRedirect({
                    cta_id: 'card_games',
                    href: EXTERNAL_URLS.games,
                    position: 'FunnelA_JetztSpielen_Click',
                    delayMs: 120,
                  })
                }
                className="btn-secondary w-full min-h-[48px] focus:ring-4 focus:ring-[var(--accent-primary)]/50 focus:outline-none"
              >
                {t('features.match.cta')}
              </button>
            </Card>

            <Card className="p-8 border-2 hover:border-orange-500/50 transition-all hover:shadow-xl">
              <div className="w-16 h-16 mb-4 mx-auto bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-center">{t('features.battle.title')}</h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] text-center leading-relaxed mb-6">
                {t('features.battle.description')}
              </p>
              <button
                type="button"
                onClick={() =>
                  trackAndRedirect({
                    cta_id: 'card_presets',
                    href: EXTERNAL_URLS.presets,
                    position: 'FunnelA_FertigeDecks_Click',
                    delayMs: 120,
                  })
                }
                className="btn-secondary w-full min-h-[48px] focus:ring-4 focus:ring-[var(--accent-primary)]/50 focus:outline-none"
              >
                {t('features.battle.cta')}
              </button>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 px-6 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 sm:mb-6 tracking-tight">
            {t('final.title')}
          </h2>
          <p className="text-center text-[var(--text-secondary)] text-sm sm:text-base md:text-lg mb-8 sm:mb-12 md:mb-16 max-w-3xl mx-auto leading-relaxed">
            {t('final.description')}
          </p>

          <div className="flex flex-col gap-4 items-center w-full max-w-md mx-auto">
            <button
              type="button"
              onClick={() =>
                trackAndRedirect({
                  cta_id: 'final_studio',
                  href: EXTERNAL_URLS.studio,
                  position: 'FunnelA_EiGestalten_Click',
                  delayMs: 120,
                })
              }
              className="btn-primary w-full sm:w-auto sm:min-w-[200px] min-h-[48px] focus:ring-4 focus:ring-[var(--accent-primary)]/50 focus:outline-none"
            >
              {t('final.createEgg')}
            </button>
            <a
              href={appendAttributionToUrl(EXTERNAL_URLS.presets)}
              onClick={(e) =>
                handleOutboundClick(e, 'final_presets', EXTERNAL_URLS.presets, 'FunnelA_FertigeDecks_Click')
              }
              className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] underline underline-offset-4 transition-colors min-h-[48px] flex items-center focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:outline-none rounded px-2"
            >
              {t('final.viewDecks')}
            </a>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto text-center text-[var(--text-muted)] text-sm">
          {t('footer.copyright')}
        </div>
      </footer>
    </div>
  );
}
