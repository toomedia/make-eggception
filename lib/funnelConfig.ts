import { EXTERNAL_URLS, type CtaId } from '@/lib/egg-analytics/ctas'

type CtaLink = {
  id: CtaId
  href: string
  position: string
}

export type FunnelConfig = {
  app: 'make' | 'play'
  variant: string
  metadata: {
    title: string
    description: string
    url: string
    imageUrl: string
    imageAlt: string
  }
  hero: {
    imageSrc: string
    imageAlt: string
    primaryCta: CtaLink
    secondaryCta: CtaLink
  }
  steps: {
    primaryCta: CtaLink
    secondaryCta: CtaLink
  }
  cards: {
    primaryCta: CtaLink
    secondaryCta: CtaLink
    calloutCta: CtaLink
  }
  final: {
    primaryCta: CtaLink
    secondaryCta: CtaLink
  }
}

export const funnelConfig: FunnelConfig = {
  app: 'make',
  variant: 'funnel_a',
  metadata: {
    title: 'Eggception - Wie Memory, nur in deinem Style',
    description: 'Kurze Matches. Deine eigenen Karten. Browser auf – Prompt rein – Ei raus. Dann Deck bauen & battlen.',
    url: 'https://make.eggception.club',
    imageUrl: 'https://make.eggception.club/funal_a.png',
    imageAlt: 'Eggception - Wie Memory, nur in deinem Style',
  },
  hero: {
    imageSrc: '/funal_a.png',
    imageAlt: 'Eggception Make - Create your own memory cards',
    primaryCta: {
      id: 'hero_studio',
      href: EXTERNAL_URLS.studio,
      position: 'hero',
    },
    secondaryCta: {
      id: 'hero_games',
      href: EXTERNAL_URLS.games,
      position: 'hero',
    },
  },
  steps: {
    primaryCta: {
      id: 'steps_studio',
      href: EXTERNAL_URLS.studio,
      position: 'steps',
    },
    secondaryCta: {
      id: 'steps_presets',
      href: EXTERNAL_URLS.presets,
      position: 'steps',
    },
  },
  cards: {
    primaryCta: {
      id: 'card_studio',
      href: EXTERNAL_URLS.studio,
      position: 'cards',
    },
    secondaryCta: {
      id: 'card_presets',
      href: EXTERNAL_URLS.presets,
      position: 'cards',
    },
    calloutCta: {
      id: 'callout_games',
      href: EXTERNAL_URLS.studio,
      position: 'callout',
    },
  },
  final: {
    primaryCta: {
      id: 'final_studio',
      href: EXTERNAL_URLS.studio,
      position: 'final',
    },
    secondaryCta: {
      id: 'final_presets',
      href: EXTERNAL_URLS.presets,
      position: 'final',
    },
  },
}
