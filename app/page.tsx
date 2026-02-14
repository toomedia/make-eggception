'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Check, Info, Sparkles, Workflow, Zap, Gamepad2, Palette } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from '@/components/ui/custom-buttons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  captureAcquisitionFromUrl,
  getAcquisitionParams,
  appendAcqParams,
} from '@/lib/acquisition';
import { track } from '@/lib/track';
import { trackUTMToSupabase } from '@/lib/utm-tracking';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import MakeNavigation from '@/components/MakeNavigation';

const EXTERNAL_URLS = {
  home: 'https://www.eggception.club/',
  games: 'https://www.eggception.club/games',
  presets: 'https://www.eggception.club/presets',
  studio: 'https://www.eggception.club/design/studio',
};

export default function Home() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    console.log('[FunnelA] 🚀 Page loaded');
    
    // Capture UTM parameters and tracking data
    const acq = captureAcquisitionFromUrl();
    console.log('[FunnelA] 📊 Acquisition params:', acq);
    
    // Track to Supabase (first-touch attribution)
    if (acq) {
      trackUTMToSupabase(acq).then((tracked) => {
        if (tracked) {
          console.log('[FunnelA] UTM data tracked to Supabase');
        } else {
          console.log('[FunnelA] UTM tracking skipped (already tracked or no params)');
        }
      }).catch((error) => {
        console.error('[FunnelA] Failed to track UTM to Supabase:', error);
      });
    }
    
    // Get stored acquisition params for PostHog
    const storedAcq = getAcquisitionParams();
    
    // Wait for PostHog to be ready before tracking (max 3 seconds)
    let attempts = 0;
    const maxAttempts = 30; // 30 * 100ms = 3 seconds max wait
    
    const waitForPostHog = () => {
      attempts++;
      if ((window as any).posthog && ((window as any).posthog.__loaded || (window as any).posthog.get_distinct_id)) {
        console.log('[FunnelA] PostHog ready, tracking page view');
        track('FunnelA_PageView', {
          path: '/',
          variant: 'funnel_a',
          ...storedAcq,
        });
      } else if (attempts < maxAttempts) {
        // Retry after 100ms if PostHog not ready
        setTimeout(waitForPostHog, 100);
      } else {
        console.warn('[FunnelA] ⚠️ PostHog not ready after 3 seconds, tracking anyway');
        track('FunnelA_PageView', {
          path: '/',
          variant: 'funnel_a',
          ...storedAcq,
        });
      }
    };
    
    // Start waiting for PostHog
    waitForPostHog();

    const handleScroll = () => {
      // Scroll handling for other purposes
    };

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, []);

  const handleCTAClick = (cta: string, url: string, eventName: string) => {
    console.log('[FunnelA] 🖱️ Button clicked:', { cta, url, eventName });
    const acq = getAcquisitionParams();
    // Emit specific Funnel-A event
    track(eventName, {
      cta,
      variant: 'funnel_a',
      url,
      ...acq,
    });
    
    // Give PostHog time to send the event before redirecting
    const redirectUrl = appendAcqParams(url);
    console.log('[FunnelA] 🔗 Redirecting to:', redirectUrl);
    
    // Small delay to ensure event is sent to PostHog
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <MakeNavigation />
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <picture>
          <source
            media="(min-width: 1600px)"
            srcSet="/funal_a.png"
          />
          <source
            media="(min-width: 1200px)"
            srcSet="/funal_a.png"
          />
          <source
            media="(min-width: 600px)"
            srcSet="/funal_a.png"
          />
          <img
            src="/funal_a.png"
            alt="Eggception Make - Create your own memory cards"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </picture>
        <div className="absolute inset-0 bg-black/40" />
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gradient-to-b from-black/30 via-black/20 to-black/40' : 'bg-gradient-to-b from-white/20 via-white/10 to-white/30'}`} />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-16">
                   <h1 className={`text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight ${theme === 'light' ? 'text-white' : ''}`}>
            {t('hero.title').split('your style').length > 1 ? (
              <>Like Memory, but in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#F7931E] font-black animate-pulse [animation-duration:3s]">your</span> style.</>
            ) : (
              <>Wie Memory, nur in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#F7931E] font-black animate-pulse [animation-duration:3s]">deinem</span> Style.</>
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
              onClick={() => handleCTAClick('hero_studio', EXTERNAL_URLS.studio, 'FunnelA_EiGestalten_Click')}
              className="w-full sm:w-auto sm:min-w-[240px] min-h-[60px] text-lg sm:text-xl font-bold shadow-2xl focus:ring-4 focus:ring-[var(--accent-primary)]/50 focus:outline-none transform hover:scale-105 transition-transform"
            >
              {t('hero.createEgg')}
            </PrimaryButton>
            <a
              href={appendAcqParams(EXTERNAL_URLS.games)}
              onClick={() => handleCTAClick('hero_games', EXTERNAL_URLS.games, 'FunnelA_JetztSpielen_Click')}
              className={`${theme === 'dark' ? 'text-white/90 hover:text-white' : 'text-white hover:text-white'} underline underline-offset-4 transition-colors min-h-[48px] flex items-center focus:ring-2 focus:ring-white/50 focus:outline-none rounded px-2 text-lg font-semibold`}
            >
              {t('hero.playNow')}
            </a>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center">
            <span className="px-5 py-3 bg-[var(--card-bg)] backdrop-blur-sm rounded-full text-base sm:text-sm border border-[var(--border-color)] font-medium shadow-lg text-white">
              {t('hero.badge1')}
            </span>
            <span className="px-5 py-3 bg-[var(--card-bg)] backdrop-blur-sm rounded-full text-base sm:text-sm border border-[var(--border-color)] font-medium shadow-lg text-white">
              {t('hero.badge2')}
            </span>
            <span className="px-5 py-3 bg-[var(--card-bg)] backdrop-blur-sm rounded-full text-base sm:text-sm border border-[var(--border-color)] font-medium shadow-lg text-white">
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

      <section
        id="how-it-works"
        className="py-12 sm:py-16 md:py-20 px-6 bg-[var(--bg-secondary)]"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 md:mb-16 tracking-tight">
            {t('howItWorks.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <Card className="p-8 border-2 hover:border-orange-500/50 transition-all hover:shadow-xl">
              <div className="w-16 h-16 mb-4 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Idee Icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-center">{t('howItWorks.step1Title')}</h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] text-center leading-relaxed">
                {t('howItWorks.step1Description')}
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-green-500/50 transition-all hover:shadow-xl">
              <div className="w-16 h-16 mb-4 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Schlüpfen Icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-center">{t('howItWorks.step2Title')}</h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] text-center leading-relaxed">
                {t('howItWorks.step2Description')}
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-blue-500/50 transition-all hover:shadow-xl">
              <div className="w-16 h-16 mb-4 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Battlen Icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-center">{t('howItWorks.step3Title')}</h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] text-center leading-relaxed">
                {t('howItWorks.step3Description')}
              </p>
            </Card>
          </div>

          <div className="flex flex-col gap-4 items-center w-full max-w-md mx-auto">
            <PrimaryButton
              onClick={() => handleCTAClick('steps_studio', EXTERNAL_URLS.studio, 'FunnelA_EiGestalten_Click')}
              className="w-full sm:w-auto sm:min-w-[200px] min-h-[48px] focus:ring-4 focus:ring-[var(--accent-primary)]/50 focus:outline-none"
            >
              {t('howItWorks.createEgg')}
            </PrimaryButton>
            <a
              href={appendAcqParams(EXTERNAL_URLS.presets)}
              onClick={() => handleCTAClick('steps_presets', EXTERNAL_URLS.presets, 'FunnelA_Presets_Click')}
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
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-center">
                {t('features.click.title')}
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] text-center leading-relaxed mb-6">
                {t('features.click.description')}
              </p>
              <PrimaryButton
                onClick={() => handleCTAClick('card_studio', EXTERNAL_URLS.studio, 'FunnelA_EiGestalten_Click')}
                className="w-full min-h-[48px] focus:ring-4 focus:ring-[var(--accent-primary)]/50 focus:outline-none"
              >
                {t('features.click.cta')}
              </PrimaryButton>
            </Card>

            <Card className="p-8 border-2 hover:border-green-500/50 transition-all hover:shadow-xl">
              <div className="w-16 h-16 mb-4 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
                <Workflow className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-center">
                {t('features.match.title')}
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] text-center leading-relaxed mb-6">
                {t('features.match.description')}
              </p>
              <SecondaryButton
                onClick={() => handleCTAClick('card_games', EXTERNAL_URLS.games, 'FunnelA_JetztSpielen_Click')}
                className="w-full min-h-[48px] focus:ring-4 focus:ring-[var(--accent-primary)]/50 focus:outline-none"
              >
                {t('features.match.cta')}
              </SecondaryButton>
            </Card>

            <Card className="p-8 border-2 hover:border-orange-500/50 transition-all hover:shadow-xl">
              <div className="w-16 h-16 mb-4 mx-auto bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-center">
                {t('features.battle.title')}
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] text-center leading-relaxed mb-6">
                {t('features.battle.description')}
              </p>
              <SecondaryButton
                onClick={() => handleCTAClick('card_presets', EXTERNAL_URLS.presets, 'FunnelA_FertigeDecks_Click')}
                className="w-full min-h-[48px] focus:ring-4 focus:ring-[var(--accent-primary)]/50 focus:outline-none"
              >
                {t('features.battle.cta')}
              </SecondaryButton>
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
            <PrimaryButton
              onClick={() => handleCTAClick('final_studio', EXTERNAL_URLS.studio, 'FunnelA_EiGestalten_Click')}
              className="w-full sm:w-auto sm:min-w-[200px] min-h-[48px] focus:ring-4 focus:ring-[var(--accent-primary)]/50 focus:outline-none"
            >
              {t('final.createEgg')}
            </PrimaryButton>
            <a
              href={appendAcqParams(EXTERNAL_URLS.presets)}
              onClick={() => handleCTAClick('final_presets', EXTERNAL_URLS.presets, 'FunnelA_FertigeDecks_Click')}
              className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] underline underline-offset-4 transition-colors min-h-[48px] flex items-center focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:outline-none rounded px-2"
            >
              {t('final.viewDecks')}
            </a>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-gray-400">
        <div className="max-w-6xl mx-auto text-center text-[var(--text-muted)] text-sm">
          <p>© {new Date().getFullYear()} Eggception. {t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
