export type ConsentState = {
  analytics: boolean;
  marketing: boolean;
  source: string;
  status: 'granted' | 'denied' | 'unknown';
};

export const EGG_CONSENT_COOKIE = 'egg_consent_v1';
export const EGG_CONSENT_COOKIE_MAX_AGE_SECONDS = 15_552_000; // 180 days

export type ConsentCookieValue = {
  v: 1;
  analytics: boolean;
  marketing: boolean;
  source: string;
  ts: number;
};

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

function safeParseConsentCookieValue(raw: string | undefined): ConsentCookieValue | undefined {
  if (!raw) return undefined;

  const direct = safeJsonParse(raw);
  if (direct) return direct as ConsentCookieValue;

  try {
    const decoded = decodeURIComponent(raw);
    const parsed = safeJsonParse(decoded);
    return parsed as ConsentCookieValue | undefined;
  } catch {
    return undefined;
  }
}

function consentFromEggCookie(): ConsentState | undefined {
  const raw = readCookie(EGG_CONSENT_COOKIE);
  const parsed = safeParseConsentCookieValue(raw);
  if (!parsed || parsed.v !== 1) return undefined;
  if (typeof parsed.analytics !== 'boolean' || typeof parsed.marketing !== 'boolean') return undefined;
  if (typeof parsed.source !== 'string' || typeof parsed.ts !== 'number') return undefined;
  const status: ConsentState['status'] =
    parsed.analytics || parsed.marketing ? 'granted' : 'denied';
  return { analytics: parsed.analytics, marketing: parsed.marketing, source: parsed.source || 'egg_cookie', status };
}

export function readConsentCookieValue(): ConsentCookieValue | null {
  const raw = readCookie(EGG_CONSENT_COOKIE);
  const parsed = safeParseConsentCookieValue(raw);
  if (!parsed || parsed.v !== 1) return null;
  if (typeof parsed.analytics !== 'boolean' || typeof parsed.marketing !== 'boolean') return null;
  if (typeof parsed.source !== 'string' || typeof parsed.ts !== 'number') return null;
  return parsed;
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
  // Backwards-compat: old shape {analytics:boolean, marketing?:boolean}
  const analytics = typeof (parsed as any).analytics === 'boolean' ? (parsed as any).analytics : undefined;
  const marketing = typeof (parsed as any).marketing === 'boolean' ? (parsed as any).marketing : false;
  if (typeof analytics !== 'boolean') return undefined;
  const status: ConsentState['status'] =
    analytics || marketing ? 'granted' : 'denied';
  return { analytics, marketing, source: 'localStorage_legacy', status };
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

export function persistConsent(options: { analytics: boolean; marketing: boolean; source: string }): void {
  if (typeof document === 'undefined') return;
  const value: ConsentCookieValue = {
    v: 1,
    analytics: options.analytics,
    marketing: options.marketing,
    source: options.source,
    ts: Date.now(),
  };
  const encoded = encodeURIComponent(JSON.stringify(value));
  const parts = [
    `${EGG_CONSENT_COOKIE}=${encoded}`,
    'Domain=.eggception.club',
    'Path=/',
    'SameSite=Lax',
    'Secure',
    `Max-Age=${EGG_CONSENT_COOKIE_MAX_AGE_SECONDS}`,
  ];
  document.cookie = parts.join('; ');
}

export function persistConsentIfAccepted(options: { analytics: boolean; marketing: boolean }): void {
  if (typeof document === 'undefined') return;
  // Backwards-compatible alias: treat as funnel banner accept.
  persistConsent({ ...options, source: 'funnel_banner' });
}

export function clearPersistedConsent(): void {
  if (typeof document === 'undefined') return;
  const parts = [
    `${EGG_CONSENT_COOKIE}=`,
    'Domain=.eggception.club',
    'Path=/',
    'SameSite=Lax',
    'Secure',
    'Max-Age=0',
  ];
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
