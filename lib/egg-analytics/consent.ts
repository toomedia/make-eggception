export type ConsentState = {
  analytics: boolean;
  marketing: boolean;
  source: string;
  status: 'granted' | 'denied' | 'unknown';
};

export const EGG_CONSENT_COOKIE = 'egg_consent_v1';

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1] ?? '') : undefined;
}

function safeJsonParse(value: string | undefined): any | undefined {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

type StoredConsent = { v: 1; analytics: boolean; marketing: boolean; updated_at: string };

function consentFromEggCookie(): ConsentState | undefined {
  const raw = readCookie(EGG_CONSENT_COOKIE);
  const parsed = safeJsonParse(raw) as StoredConsent | undefined;
  if (!parsed || parsed.v !== 1) return undefined;
  if (typeof parsed.analytics !== 'boolean' || typeof parsed.marketing !== 'boolean') return undefined;
  const status: ConsentState['status'] =
    parsed.analytics || parsed.marketing ? 'granted' : 'denied';
  return { analytics: parsed.analytics, marketing: parsed.marketing, source: 'egg_cookie', status };
}

function consentFromCookiebot(): ConsentState | undefined {
  const cookiebot = (globalThis as any).Cookiebot;
  if (!cookiebot?.consent) return undefined;
  const analytics = Boolean(cookiebot.consent.statistics);
  const marketing = Boolean(cookiebot.consent.marketing);
  const status: ConsentState['status'] =
    analytics || marketing ? 'granted' : 'denied';
  return { analytics, marketing, source: 'cookiebot', status };
}

function consentFromOneTrust(): ConsentState | undefined {
  const groups = (globalThis as any).OnetrustActiveGroups as string | undefined;
  if (groups) {
    // Heuristic: treat any active group beyond strictly-necessary as granted.
    const normalized = groups.split(',').map((g) => g.trim()).filter(Boolean);
    const hasNonEssential = normalized.length > 0;
    return {
      analytics: hasNonEssential,
      marketing: hasNonEssential,
      source: 'onetrust',
      status: hasNonEssential ? 'granted' : 'unknown',
    };
  }

  const optanon = readCookie('OptanonConsent');
  if (!optanon) return undefined;
  // OptanonConsent is not reliably parseable without vendor config.
  return { analytics: false, marketing: false, source: 'onetrust', status: 'unknown' };
}

function consentFromLocalDebug(): ConsentState | undefined {
  if (typeof window === 'undefined') return undefined;
  const raw = window.localStorage?.getItem('egg_consent_v1');
  const parsed = safeJsonParse(raw ?? undefined);
  if (!parsed || typeof parsed !== 'object') return undefined;
  if (typeof parsed.analytics !== 'boolean' || typeof parsed.marketing !== 'boolean')
    return undefined;
  const status: ConsentState['status'] =
    parsed.analytics || parsed.marketing ? 'granted' : 'denied';
  return { analytics: parsed.analytics, marketing: parsed.marketing, source: 'debug', status };
}

export function readConsent(): ConsentState {
  if (typeof window === 'undefined') {
    return { analytics: false, marketing: false, source: 'ssr', status: 'unknown' };
  }

  return (
    consentFromEggCookie() ??
    consentFromCookiebot() ??
    consentFromOneTrust() ??
    consentFromLocalDebug() ?? {
      analytics: false,
      marketing: false,
      source: 'unknown',
      status: 'unknown',
    }
  );
}

function getDefaultCookieDomain(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const override = process.env.NEXT_PUBLIC_EGG_COOKIE_DOMAIN;
  if (override) return override;
  const host = window.location.hostname;
  if (host === 'eggception.club' || host.endsWith('.eggception.club')) return '.eggception.club';
  return undefined;
}

export function persistConsentIfAccepted(options: { analytics: boolean; marketing: boolean }): void {
  if (typeof document === 'undefined') return;
  if (!options.analytics && !options.marketing) return;

  const value: StoredConsent = { v: 1, analytics: options.analytics, marketing: options.marketing, updated_at: new Date().toISOString() };
  const encoded = encodeURIComponent(JSON.stringify(value));
  const maxAgeSeconds = 180 * 24 * 60 * 60;
  const domain = getDefaultCookieDomain();
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:';

  const parts = [
    `${EGG_CONSENT_COOKIE}=${encoded}`,
    `Path=/`,
    `Max-Age=${maxAgeSeconds}`,
    `SameSite=Lax`,
    secure ? 'Secure' : '',
    domain ? `Domain=${domain}` : '',
  ].filter(Boolean);

  document.cookie = parts.join('; ');
}

export function clearPersistedConsent(): void {
  if (typeof document === 'undefined') return;
  const domain = getDefaultCookieDomain();
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:';

  const parts = [
    `${EGG_CONSENT_COOKIE}=`,
    `Path=/`,
    `Max-Age=0`,
    `SameSite=Lax`,
    secure ? 'Secure' : '',
    domain ? `Domain=${domain}` : '',
  ].filter(Boolean);

  document.cookie = parts.join('; ');
}

export function onConsentChange(callback: (next: ConsentState) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = () => callback(readConsent());

  // Cookiebot
  window.addEventListener('CookiebotOnAccept', handler as any);
  window.addEventListener('CookiebotOnDecline', handler as any);
  window.addEventListener('CookiebotOnLoad', handler as any);

  // OneTrust
  window.addEventListener('OneTrustGroupsUpdated', handler as any);

  // Custom app event for local/manual QA: window.dispatchEvent(new CustomEvent('egg:consent_update'))
  window.addEventListener('egg:consent_update', handler as any);

  return () => {
    window.removeEventListener('CookiebotOnAccept', handler as any);
    window.removeEventListener('CookiebotOnDecline', handler as any);
    window.removeEventListener('CookiebotOnLoad', handler as any);
    window.removeEventListener('OneTrustGroupsUpdated', handler as any);
    window.removeEventListener('egg:consent_update', handler as any);
  };
}
