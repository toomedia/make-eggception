export type Language = 'de' | 'en'

export interface Translations {
  consent?: {
    title: string
    description: string
    decline: string
    accept: string
  }
  nav: {
    games: string
    presets: string
  }
  hero: {
    title: string
    titleHighlight: string
    titleSuffix: string
    subtitle: string
    description?: string
    eggExplanation?: string
    createEgg?: string
    playNow?: string
    freeStart?: string
    playButton: string
    presetsLink: string
    badge1: string
    badge2: string
    badge3: string
  }
  howItWorks?: {
    title: string
    step1Title: string
    step1Description: string
    step2Title: string
    step2Description: string
    step3Title: string
    step3Description: string
    createEgg: string
    toPresets: string
  }
  features?: {
    title: string
    deckExplanation: string
    click: {
      title: string
      description: string
      cta: string
    }
    match: {
      title: string
      description: string
      cta: string
    }
    battle: {
      title: string
      description: string
      cta: string
    }
  }
  steps: {
    title: string
    step1Title: string
    step1Desc: string
    step2Title: string
    step2Desc: string
    step3Title: string
    step3Desc: string
    playButton: string
    presetsLink: string
  }
  cards: {
    card1Title: string
    card1Point1: string
    card1Point2: string
    card1Point3: string
    card1Button: string
    card2Title: string
    card2Point1: string
    card2Point2: string
    card2Point3: string
    card2Button: string
    calloutText: string
    calloutLink: string
  }
  benefits: {
    title: string
    subtitle: string
    benefit1Title: string
    benefit1Desc: string
    benefit2Title: string
    benefit2Desc: string
    benefit3Title: string
    benefit3Desc: string
  }
  testimonials: {
    title: string
    testimonial1: string
    testimonial1Author: string
    testimonial2: string
    testimonial2Author: string
    testimonial3: string
    testimonial3Author: string
  }
  faq: {
    title: string
    q1: string
    a1: string
    q2: string
    a2: string
    q3: string
    a3: string
  }
  final: {
    title: string
    description?: string
    createEgg?: string
    viewDecks?: string
    playButton: string
    presetsLink: string
  }
  footer: {
    copyright: string
  }
}

export const translations: Record<Language, Translations> = {
  de: {
    consent: {
      title: 'Datenschutz-Einstellungen',
      description: 'Erlaube Spielanalyse, damit wir die Experience verbessern können. Marketing bleibt optional.',
      decline: 'Ablehnen',
      accept: 'Tracking erlauben',
    },
    nav: {
      games: 'Spiele',
      presets: 'Presets',
    },
    hero: {
      title: 'Wie Memory, nur in deinem ',
      titleHighlight: 'Style',
      titleSuffix: '.',
      subtitle: 'Kurze Matches. Deine eigenen Karten.',
      description: 'Browser auf – Prompt rein – Ei raus. Dann Deck bauen & battlen.',
      eggExplanation: '„Ei" = deine erste Karte im Eggception-Style.',
      createEgg: 'Ei gestalten',
      playNow: 'Jetzt spielen',
      freeStart: 'Kostenlos starten · Ohne Anmeldung',
      playButton: 'Ei gestalten',
      presetsLink: 'Jetzt spielen',
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
    steps: {
      title: 'In 2 Minuten startklar.',
      step1Title: 'Idee rein',
      step1Desc: 'Ein Satz reicht. Style, Mood, Thema.',
      step2Title: 'Ei schlüpft',
      step2Desc: 'Dein erstes Piece ist da. Du kannst nachlegen.',
      step3Title: 'Deck bauen & battlen',
      step3Desc: 'Mixen, matchen, spielen.',
      playButton: 'Ei gestalten',
      presetsLink: 'Zu den Presets',
    },
    cards: {
      card1Title: 'Dein Prompt, dein Ei',
      card1Point1: 'Erstes Ei in Sekunden',
      card1Point2: 'Karten in deinem Style',
      card1Point3: 'Dein Deck, dein Spiel',
      card1Button: 'Ei gestalten',
      card2Title: 'Fertige Decks',
      card2Point1: 'Sofort spielbereit',
      card2Point2: 'Inspiration für dein Deck',
      card2Point3: 'Für dich und deine Crew',
      card2Button: 'Zu den Presets',
      calloutText: 'Noch keine Idee? Starte mit einem Preset und baue es aus.',
      calloutLink: 'Jetzt loslegen →',
    },
    benefits: {
      title: 'Dein Stil gewinnt',
      subtitle: 'Nicht nur gewinnen – deinen Look zeigen.',
      benefit1Title: 'Einfach starten',
      benefit1Desc: 'Prompt rein, Ei raus, fertig.',
      benefit2Title: 'Dein Design',
      benefit2Desc: 'Karten sehen aus wie du – nicht wie ein Template.',
      benefit3Title: 'Teilen & battlen',
      benefit3Desc: 'Link schicken, sofort gemeinsam spielen.',
    },
    testimonials: {
      title: 'Was andere sagen',
      testimonial1: '"Mein erstes Ei war in 2 Minuten fertig – mega!"',
      testimonial1Author: '— Lina',
      testimonial2: '"Wir haben direkt ein Deck gebaut und losgespielt."',
      testimonial2Author: '— Markus',
      testimonial3: '"Sieht nach mir aus – endlich!"',
      testimonial3Author: '— Jess',
    },
    faq: {
      title: 'Fragen? Haben wir.',
      q1: 'Brauche ich Design-Skills?',
      a1: 'Nein. Ein Satz reicht, der Rest passiert automatisch.',
      q2: 'Kann ich sofort spielen?',
      a2: 'Ja, nach dem ersten Ei kannst du direkt loslegen.',
      q3: 'Kann ich mein Deck teilen?',
      a3: 'Klar. Link teilen und Freunde können sofort mitspielen.',
    },
    final: {
      title: 'Zeig deinen Style. Nicht deinen Score.',
      description: 'Dein Ei ist dein Signature-Move. Teilen per Link – und schauen, wer damit klar kommt.',
      createEgg: 'Ei gestalten',
      viewDecks: 'Fertige Decks ansehen',
      playButton: 'Ei gestalten',
      presetsLink: 'Fertige Decks ansehen',
    },
    footer: {
      copyright: '© 2026 Eggception. Alle Rechte vorbehalten.',
    },
  },
  en: {
    consent: {
      title: 'Privacy settings',
      description: 'Allow gameplay analytics to help us improve the experience. Marketing stays optional.',
      decline: 'Decline',
      accept: 'Allow tracking',
    },
    nav: {
      games: 'Games',
      presets: 'Presets',
    },
    hero: {
      title: 'Like Memory, but in your style.',
      titleHighlight: 'style',
      titleSuffix: '.',
      subtitle: 'Short matches. Your own cards.',
      description: 'Browser open – Prompt in – Egg out. Then build deck & battle.',
      eggExplanation: '"Egg" = your first card in Eggception style.',
      createEgg: 'Create Egg',
      playNow: 'Play Now',
      freeStart: 'Start for free · No registration',
      playButton: 'Create Egg',
      presetsLink: 'Play Now',
      badge1: '0 Euros, 100% Fun',
      badge2: 'Brains over luck',
      badge3: 'Ages 6 to 99',
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
    steps: {
      title: 'Ready in 2 minutes.',
      step1Title: 'Idea in',
      step1Desc: 'One sentence is enough. Style, mood, theme.',
      step2Title: 'Egg hatches',
      step2Desc: 'Your first piece is here. You can add more.',
      step3Title: 'Build deck & battle',
      step3Desc: 'Mix, match, play.',
      playButton: 'Create Egg',
      presetsLink: 'To Presets',
    },
    cards: {
      card1Title: 'Your prompt, your egg',
      card1Point1: 'First egg in seconds',
      card1Point2: 'Cards in your style',
      card1Point3: 'Your deck, your game',
      card1Button: 'Create Egg',
      card2Title: 'Ready-made decks',
      card2Point1: 'Instantly playable',
      card2Point2: 'Inspiration for your deck',
      card2Point3: 'For you and your friends',
      card2Button: 'View Presets',
      calloutText: 'No idea yet? Start with a preset and build from there.',
      calloutLink: 'Start now →',
    },
    benefits: {
      title: 'Your style wins',
      subtitle: 'Not just winning — showing your look.',
      benefit1Title: 'Easy start',
      benefit1Desc: 'Prompt in, egg out, done.',
      benefit2Title: 'Your design',
      benefit2Desc: 'Cards look like you, not a template.',
      benefit3Title: 'Share & battle',
      benefit3Desc: 'Send a link and play together instantly.',
    },
    testimonials: {
      title: 'What others say',
      testimonial1: '"My first egg was done in 2 minutes — awesome!"',
      testimonial1Author: '— Lina',
      testimonial2: '"We built a deck and started right away."',
      testimonial2Author: '— Markus',
      testimonial3: '"Finally looks like me."',
      testimonial3Author: '— Jess',
    },
    faq: {
      title: 'Questions? We have them.',
      q1: 'Do I need design skills?',
      a1: 'No. One sentence is enough — the rest happens automatically.',
      q2: 'Can I play right away?',
      a2: 'Yes, after your first egg you can start immediately.',
      q3: 'Can I share my deck?',
      a3: 'Absolutely. Share the link and friends can join instantly.',
    },
    final: {
      title: 'Show your style. Not your score.',
      description: 'Your egg is your signature move. Share via link – and see who can handle it.',
      createEgg: 'Create Egg',
      viewDecks: 'View Ready Decks',
      playButton: 'Create Egg',
      presetsLink: 'View ready-made decks',
    },
    footer: {
      copyright: '© 2026 Eggception. All rights reserved.',
    },
  },
}
