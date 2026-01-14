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

const EXTERNAL_URLS = {
  home: 'https://www.eggception.club/',
  games: 'https://www.eggception.club/games',
  presets: 'https://www.eggception.club/presets',
  studio: 'https://www.eggception.club/design/studio',
};

export default function Home() {
  useEffect(() => {
    console.log('[FunnelA] 🚀 Page loaded');
    captureAcquisitionFromUrl();
    const acq = getAcquisitionParams();
    console.log('[FunnelA] 📊 Acquisition params:', acq);
    track('FunnelA_PageView', {
      path: '/',
      variant: 'funnel_a',
      ...acq,
    });
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
    console.log('[FunnelA] 🔗 Redirecting to:', appendAcqParams(url));
    window.location.href = appendAcqParams(url);
  };

  return (
    <div className="min-h-screen bg-black">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/funal_a.png"
            alt="Eggception Hero"
            fill
            priority
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLElement;
              target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight">
            Wie Memory, nur in d<span className="relative inline-block"><span className="absolute inset-0 bg-blue-500/20 -skew-x-12 rounded"></span><span className="relative text-orange-400">ei</span></span>nem Style.
          </h1>

          <p className="text-xl sm:text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
            Kurze Matches. Deine eigenen Karten.
            <br />
            Browser auf – Prompt rein – Ei raus. Dann Deck bauen & battlen.
          </p>

          <p className="text-sm text-white/60 mb-12 max-w-2xl mx-auto">
            „Ei" = deine erste Karte im Eggception-Style.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 mb-12 max-w-md mx-auto">
            <PrimaryButton
              onClick={() => handleCTAClick('hero_studio', EXTERNAL_URLS.studio, 'FunnelA_EiGestalten_Click')}
              className="w-full text-lg"
            >
              Ei gestalten
            </PrimaryButton>

            <p className="text-sm text-white/70">
              Kostenlos starten · Ohne Anmeldung
            </p>

            <SecondaryButton
              onClick={() => handleCTAClick('hero_games', EXTERNAL_URLS.games, 'FunnelA_JetztSpielen_Click')}
              className="w-full text-lg"
            >
              Jetzt spielen
            </SecondaryButton>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 px-4">
            <div className="px-5 py-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/30">
              <span className="text-sm font-medium text-white">0 Euro, 100% Fun</span>
            </div>
            <div className="px-5 py-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/30">
              <span className="text-sm font-medium text-white">Köpfchen statt Glück</span>
            </div>
            <div className="px-5 py-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/30">
              <span className="text-sm font-medium text-white">Von 6 bis 99</span>
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
            In 2 Minuten startklar.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="border-2 hover:border-orange-500/50 transition-colors p-6">
              <CardHeader>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-3xl font-black mb-6 shadow-xl">
                  1
                </div>
                <CardTitle className="text-3xl font-bold">Idee rein</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Ein Satz reicht. Style, Mood, Thema.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-500/50 transition-colors p-6">
              <CardHeader>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-3xl font-black mb-6 shadow-xl">
                  2
                </div>
                <CardTitle className="text-3xl font-bold">Ei schlüpft</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Dein erstes Piece ist da. Du kannst nachlegen.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-500/50 transition-colors p-6">
              <CardHeader>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-3xl font-black mb-6 shadow-xl">
                  3
                </div>
                <CardTitle className="text-3xl font-bold">Deck bauen & battlen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Mixen, matchen, spielen.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <PrimaryButton
              onClick={() => handleCTAClick('steps_studio', EXTERNAL_URLS.studio, 'FunnelA_EiGestalten_Click')}
              className="w-full sm:w-auto"
            >
              Ei gestalten
            </PrimaryButton>
            <SecondaryButton
              onClick={() => handleCTAClick('steps_presets', EXTERNAL_URLS.presets, 'FunnelA_Presets_Click')}
              className="w-full sm:w-auto"
            >
              Zu den Presets
            </SecondaryButton>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-4xl md:text-5xl font-black text-center mb-3 tracking-tight">
            Dein Prompt. Dein Ei. Dein Deck.
          </h2>
          <p className="text-center text-muted-foreground mb-10 text-base max-w-2xl mx-auto">
            Deck = dein Kartenset fürs Battle.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 border-2 hover:border-blue-500/50 transition-all hover:shadow-xl">
              <CardHeader>
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6 shadow-xl">
                  <Sparkles className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>
                <CardTitle className="text-3xl font-bold mb-3">
                  Klicken
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Bau Karten, die nach dir aussehen – nicht nach Template.
                </p>
                <PrimaryButton
                  onClick={() => handleCTAClick('card_studio', EXTERNAL_URLS.studio, 'FunnelA_EiGestalten_Click')}
                  className="w-full mt-6"
                >
                  Ei gestalten
                </PrimaryButton>
              </CardContent>
            </Card>

            <Card className="p-8 border-2 hover:border-green-500/50 transition-all hover:shadow-xl">
              <CardHeader>
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-6 shadow-xl">
                  <Workflow className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>
                <CardTitle className="text-3xl font-bold mb-3">
                  Matchen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Stell dir ein Deck zusammen und spiel's direkt.
                </p>
                <SecondaryButton
                  onClick={() => handleCTAClick('card_games', EXTERNAL_URLS.games, 'FunnelA_JetztSpielen_Click')}
                  className="w-full mt-6"
                >
                  Jetzt spielen
                </SecondaryButton>
              </CardContent>
            </Card>

            <Card className="p-8 border-2 hover:border-orange-500/50 transition-all hover:shadow-xl">
              <CardHeader>
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center mb-6 shadow-xl">
                  <Zap className="w-12 h-12 text-white" strokeWidth={2.5} />
                </div>
                <CardTitle className="text-3xl font-bold mb-3">
                  Battlen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Schick den Link rum. Freunde können sofort rein.
                </p>
                <SecondaryButton
                  onClick={() => handleCTAClick('card_presets', EXTERNAL_URLS.presets, 'FunnelA_FertigeDecks_Click')}
                  className="w-full mt-6"
                >
                  Fertige Decks ansehen
                </SecondaryButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Zeig deinen Style. Nicht deinen Score.
          </h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
            Dein Ei ist dein Signature-Move. Teilen per Link – und schauen, wer damit klar kommt.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <PrimaryButton
              onClick={() => handleCTAClick('final_studio', EXTERNAL_URLS.studio, 'FunnelA_EiGestalten_Click')}
              className="w-full sm:w-auto"
            >
              Ei gestalten
            </PrimaryButton>
            <SecondaryButton
              onClick={() => handleCTAClick('final_presets', EXTERNAL_URLS.presets, 'FunnelA_FertigeDecks_Click')}
              className="w-full sm:w-auto"
            >
              Fertige Decks ansehen
            </SecondaryButton>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Eggception. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
