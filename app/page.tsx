'use client';

import { useEffect } from 'react';
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
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';

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
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 dark">
        <div className="absolute inset-0 z-0">
          <Image
            src={theme === 'dark' ? '/funal_a.png' : '/banner.png'}
            alt="Eggception Hero"
            fill
            priority
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLElement;
              target.style.display = 'none';
            }}
          />
          {theme === 'dark' && <div className="absolute inset-0 bg-black/60" />}
          {theme === 'light' && <div className="absolute inset-0 bg-black/30" />}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight ${theme === 'light' ? 'text-white' : ''}`}>

            {t('hero.title').split('your style').length > 1 ? (
              <>Like Memory, but in <span className="relative inline-block"><span className="absolute inset-0 bg-blue-500/20 -skew-x-12 rounded"></span><span className="relative text-orange-400">your</span></span> style.</>
            ) : (
              <>Wie Memory, nur in d<span className="relative inline-block"><span className="absolute inset-0 bg-blue-500/20 -skew-x-12 rounded"></span><span className="relative text-orange-400">ei</span></span>nem Style.</>
            )}
          </h1>

          <p className={`text-xl sm:text-xl md:text-2xl font-black mb-8 max-w-3xl mx-auto leading-relaxed font-medium ${theme === 'light' ? 'text-white' : ''}`}>
            {t('hero.subtitle')}
            <br />
            {t('hero.description')}
          </p>

          <p className={`text-sm font-black font-black mb-12 max-w-2xl mx-auto ${theme === 'light' ? 'text-white' : ''}`}>
            {t('hero.eggExplanation')}
          </p>

          <div className="flex flex-col items-center justify-center gap-6 mb-12 max-w-md mx-auto">
            <PrimaryButton
              onClick={() => handleCTAClick('hero_studio', EXTERNAL_URLS.studio, 'FunnelA_EiGestalten_Click')}
              className="w-full text-lg"
            >
              {t('hero.createEgg')}
            </PrimaryButton>

            <p className={`text-sm font-black ${theme === 'light' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              {t('hero.freeStart')}
            </p>

            <SecondaryButton
              onClick={() => handleCTAClick('hero_games', EXTERNAL_URLS.games, 'FunnelA_JetztSpielen_Click')}
              className="w-full text-lg"
            >
              {t('hero.playNow')}
            </SecondaryButton>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 px-4">
            <div className="px-5 py-2.5 rounded-full bg-black/50 dark:bg-black/50 backdrop-blur-md border border-white/30 dark:border-white/30">
              <span className={`text-sm font-black ${theme === 'light' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{t('hero.badge1')}</span>
            </div>
            <div className="px-5 py-2.5 rounded-full bg-black/50 dark:bg-black/50 backdrop-blur-md border border-white/30 dark:border-white/30">
              <span className={`text-sm font-black ${theme === 'light' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{t('hero.badge2')}</span>
            </div>
            <div className="px-5 py-2.5 rounded-full bg-black/50 dark:bg-black/50 backdrop-blur-md border border-white/30 dark:border-white/30">
              <span className={`text-sm font-black ${theme === 'light' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{t('hero.badge3')}</span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-16 px-6 sm:px-6 lg:px-8 bg-muted/30"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl sm:text-4xl md:text-5xl font-black text-center mb-10 tracking-tight">
            {t('howItWorks.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="border-2 hover:border-orange-500/50 transition-colors p-6">
              <CardHeader>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-3xl font-black mb-6 shadow-xl">
                  1
                </div>
                <CardTitle className="text-3xl font-bold">{t('howItWorks.step1Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t('howItWorks.step1Description')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-500/50 transition-colors p-6">
              <CardHeader>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-3xl font-black mb-6 shadow-xl">
                  2
                </div>
                <CardTitle className="text-3xl font-bold">{t('howItWorks.step2Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t('howItWorks.step2Description')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-500/50 transition-colors p-6">
              <CardHeader>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-3xl font-black mb-6 shadow-xl">
                  3
                </div>
                <CardTitle className="text-3xl font-bold">{t('howItWorks.step3Title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t('howItWorks.step3Description')}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <PrimaryButton
              onClick={() => handleCTAClick('steps_studio', EXTERNAL_URLS.studio, 'FunnelA_EiGestalten_Click')}
              className="w-full sm:w-auto"
            >
              {t('howItWorks.createEgg')}
            </PrimaryButton>
            <SecondaryButton
              onClick={() => handleCTAClick('steps_presets', EXTERNAL_URLS.presets, 'FunnelA_Presets_Click')}
              className="w-full sm:w-auto"
            >
              {t('howItWorks.toPresets')}
            </SecondaryButton>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-4xl md:text-5xl font-black text-center mb-3 tracking-tight">
            {t('features.title')}
          </h2>
          <p className="text-center text-muted-foreground mb-10 text-base max-w-2xl mx-auto">
            {t('features.deckExplanation')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 border-2 hover:border-blue-500/50 transition-all hover:shadow-xl">
              <CardHeader>
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6 shadow-xl">
                  <Sparkles className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>
                <CardTitle className="text-3xl font-bold mb-3">
                  {t('features.click.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t('features.click.description')}
                </p>
                <PrimaryButton
                  onClick={() => handleCTAClick('card_studio', EXTERNAL_URLS.studio, 'FunnelA_EiGestalten_Click')}
                  className="w-full mt-6"
                >
                  {t('features.click.cta')}
                </PrimaryButton>
              </CardContent>
            </Card>

            <Card className="p-8 border-2 hover:border-green-500/50 transition-all hover:shadow-xl">
              <CardHeader>
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-6 shadow-xl">
                  <Workflow className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>
                <CardTitle className="text-3xl font-bold mb-3">
                  {t('features.match.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t('features.match.description')}
                </p>
                <SecondaryButton
                  onClick={() => handleCTAClick('card_games', EXTERNAL_URLS.games, 'FunnelA_JetztSpielen_Click')}
                  className="w-full mt-6"
                >
                  {t('features.match.cta')}
                </SecondaryButton>
              </CardContent>
            </Card>

            <Card className="p-8 border-2 hover:border-orange-500/50 transition-all hover:shadow-xl">
              <CardHeader>
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mb-6 shadow-xl">
                  <Zap className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>
                <CardTitle className="text-3xl font-bold mb-3">
                  {t('features.battle.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t('features.battle.description')}
                </p>
                <SecondaryButton
                  onClick={() => handleCTAClick('card_presets', EXTERNAL_URLS.presets, 'FunnelA_FertigeDecks_Click')}
                  className="w-full mt-6"
                >
                  {t('features.battle.cta')}
                </SecondaryButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight">
            {t('final.title')}
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
            {t('final.description')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <PrimaryButton
              onClick={() => handleCTAClick('final_studio', EXTERNAL_URLS.studio, 'FunnelA_EiGestalten_Click')}
              className="w-full sm:w-auto"
            >
              {t('final.createEgg')}
            </PrimaryButton>
            <SecondaryButton
              onClick={() => handleCTAClick('final_presets', EXTERNAL_URLS.presets, 'FunnelA_FertigeDecks_Click')}
              className="w-full sm:w-auto"
            >
              {t('final.viewDecks')}
            </SecondaryButton>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Eggception. {t('footer.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}

