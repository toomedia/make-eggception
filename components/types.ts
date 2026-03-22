export type ConsentState = {
  analytics: boolean;
  replay: boolean;
  marketing: boolean;
};

export type ConsentStep = 1 | 2;

export const DEFAULT_CONSENT: ConsentState = {
  analytics: false,
  replay: false,
  marketing: false,
};
