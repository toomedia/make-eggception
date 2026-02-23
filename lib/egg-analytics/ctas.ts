export const EXTERNAL_URLS = {
  home: 'https://www.eggception.club/',
  games: 'https://www.eggception.club/games',
  presets: 'https://www.eggception.club/presets',
  studio: 'https://www.eggception.club/design/studio',
} as const;

export const CTA_IDS = [
  'hero_studio',
  'hero_games',
  'steps_studio',
  'steps_presets',
  'card_studio',
  'card_games',
  'card_presets',
  'final_studio',
  'final_presets',
] as const;

export type CtaId = (typeof CTA_IDS)[number];

