'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function readLangCookie(): Language | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )lang=([^;]+)/);
  const value = match?.[1];
  return value === 'de' || value === 'en' ? value : null;
}

function writeLangCookie(lang: Language) {
  if (typeof document === 'undefined') return;
  const isEggceptionDomain =
    typeof window !== 'undefined' &&
    window.location.hostname.endsWith('eggception.club');

  document.cookie = [
    `lang=${lang}`,
    'Path=/',
    'Max-Age=31536000',
    'SameSite=Lax',
    'Secure',
    isEggceptionDomain ? 'Domain=.eggception.club' : ''
  ]
    .filter(Boolean)
    .join('; ');
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('de');

  useEffect(() => {
    // 1) Cookie (cross-subdomain)
    const cookieLang = readLangCookie();
    if (cookieLang) {
      setLanguageState(cookieLang);
      document.documentElement.lang = cookieLang;
      localStorage.setItem('language', cookieLang);
      return;
    }

    // 2) Local storage
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && (savedLanguage === 'de' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
      document.documentElement.lang = savedLanguage;
      return;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    writeLangCookie(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

const translations = {
  en: {
    hero: {
      title: 'Like Memory, but in your style.',
      subtitle: 'Short matches. Your own cards.',
      description: 'Browser open – Prompt in – Egg out. Then build deck & battle.',
      eggExplanation: '"Egg" = your first card in Eggception style.',
      createEgg: 'Create Egg',
      playNow: 'Play Now',
      freeStart: 'Start for free · No registration',
      badge1: '0 Euro, 100% Fun',
      badge2: 'Brains over Luck',
      badge3: 'From 6 to 99',
    },
    howItWorks: {
      title: 'Ready in 2 minutes.',
      step1Title: 'Idea in',
      step1Description: 'One sentence is enough. Style, mood, theme.',
      step2Title: 'Egg hatches',
      step2Description: 'Your first piece is here. You can add more.',
      step3Title: 'Build deck & battle',
      step3Description: 'Mix, match, play.',
      createEgg: 'Create Egg',
      toPresets: 'To Presets',
    },
    features: {
      title: 'Your Prompt. Your Egg. Your Deck.',
      deckExplanation: 'Deck = your card set for battle.',
      click: {
        title: 'Click',
        description: 'Build cards that look like you – not like a template.',
        cta: 'Create Egg',
      },
      match: {
        title: 'Match',
        description: 'Put together a deck and play it right away.',
        cta: 'Play Now',
      },
      battle: {
        title: 'Battle',
        description: 'Send the link around. Friends can join immediately.',
        cta: 'View Ready Decks',
      },
    },
    final: {
      title: 'Show your style. Not your score.',
      description: 'Your egg is your signature move. Share via link – and see who can handle it.',
      createEgg: 'Create Egg',
      viewDecks: 'View Ready Decks',
    },
    footer: {
      copyright: 'All rights reserved.',
    },
  },
  de: {
    hero: {
      title: 'Wie Memory, nur in deinem Style.',
      subtitle: 'Kurze Matches. Deine eigenen Karten.',
      description: 'Browser auf – Prompt rein – Ei raus. Dann Deck bauen & battlen.',
      eggExplanation: '„Ei" = deine erste Karte im Eggception-Style.',
      createEgg: 'Ei gestalten',
      playNow: 'Jetzt spielen',
      freeStart: 'Kostenlos starten · Ohne Anmeldung',
      badge1: '0 Euro, 100% Fun',
      badge2: 'Köpfchen statt Glück',
      badge3: 'Von 6 bis 99',
    },
    howItWorks: {
      title: 'In 2 Minuten startklar.',
      step1Title: 'Idee rein',
      step1Description: 'Ein Satz reicht. Style, Mood, Thema.',
      step2Title: 'Ei schlüpft',
      step2Description: 'Dein erstes Piece ist da. Du kannst nachlegen.',
      step3Title: 'Deck bauen & battlen',
      step3Description: 'Mixen, matchen, spielen.',
      createEgg: 'Ei gestalten',
      toPresets: 'Zu den Presets',
    },
    features: {
      title: 'Dein Prompt. Dein Ei. Dein Deck.',
      deckExplanation: 'Deck = dein Kartenset fürs Battle.',
      click: {
        title: 'Klicken',
        description: 'Bau Karten, die nach dir aussehen – nicht nach Template.',
        cta: 'Ei gestalten',
      },
      match: {
        title: 'Matchen',
        description: 'Stell dir ein Deck zusammen und spiel\'s direkt.',
        cta: 'Jetzt spielen',
      },
      battle: {
        title: 'Battlen',
        description: 'Schick den Link rum. Freunde können sofort rein.',
        cta: 'Fertige Decks ansehen',
      },
    },
    final: {
      title: 'Zeig deinen Style. Nicht deinen Score.',
      description: 'Dein Ei ist dein Signature-Move. Teilen per Link – und schauen, wer damit klar kommt.',
      createEgg: 'Ei gestalten',
      viewDecks: 'Fertige Decks ansehen',
    },
    footer: {
      copyright: 'Alle Rechte vorbehalten.',
    },
  },
};
