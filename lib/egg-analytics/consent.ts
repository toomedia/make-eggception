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
  ts: string; // ISO string
};

type ConsentCookieValueRaw = {
  v?: unknown;
  analytics?: unknown;
  marketing?: unknown;
  source?: unknown;
  ts?: unknown;
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

function safeParseConsentCookieValue(raw: string | undefined): ConsentCookieValueRaw | undefined {
  if (!raw) return undefined;

  const direct = safeJsonParse(raw);
  if (direct) return direct as ConsentCookieValueRaw;

  try {
    const decoded = decodeURIComponent(raw);
    const parsed = safeJsonParse(decoded);
    return parsed as ConsentCookieValueRaw | undefined;
  } catch {
    return undefined;
  }
}

function normalizeConsentCookieValue(raw: ConsentCookieValueRaw | undefined): ConsentCookieValue | null {
  if (!raw) return null;
  if (raw.v !== 1) return null;
  if (typeof raw.analytics !== 'boolean' || typeof raw.marketing !== 'boolean') return null;

  const source = typeof raw.source === 'string' ? raw.source : 'unknown';
  let ts: string | null = null;
  if (typeof raw.ts === 'number') {
    ts = new Date(raw.ts).toISOString();
  } else if (typeof raw.ts === 'string') {
    ts = raw.ts;
  }
  if (!ts) return null;

  return {
    v: 1,
    analytics: raw.analytics,
    marketing: raw.marketing,
    source,
    ts,
  };
}

function consentFromEggCookie(): ConsentState | undefined {
  const raw = readCookie(EGG_CONSENT_COOKIE);
  const parsed = normalizeConsentCookieValue(safeParseConsentCookieValue(raw));
  if (!parsed) return undefined;
  const status: ConsentState['status'] =
    parsed.analytics || parsed.marketing ? 'granted' : 'denied';
  return { analytics: parsed.analytics, marketing: parsed.marketing, source: parsed.source, status };
}

export function readConsentCookieValue(): ConsentCookieValue | null {
  const raw = readCookie(EGG_CONSENT_COOKIE);
  const parsed = normalizeConsentCookieValue(safeParseConsentCookieValue(raw));
  if (!parsed) return null;
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
  return { analytics: false, marketing: false, source: 'onetrust', status: 'unknown' };
}

function consentFromLocalDebug(): ConsentState | undefined {
  if (typeof window === 'undefined') return undefined;
  const raw = window.localStorage?.getItem('egg_consent_v1');
  const parsed = safeJsonParse(raw ?? undefined);
  if (!parsed || typeof parsed !== 'object') return undefined;
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
    ts: new Date().toISOString(),
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

  window.addEventListener('CookiebotOnAccept', handler as any);
  window.addEventListener('CookiebotOnDecline', handler as any);
  window.addEventListener('CookiebotOnLoad', handler as any);

  window.addEventListener('OneTrustGroupsUpdated', handler as any);

  window.addEventListener('egg:consent_update', handler as any);

  return () => {
    window.removeEventListener('CookiebotOnAccept', handler as any);
    window.removeEventListener('CookiebotOnDecline', handler as any);
    window.removeEventListener('CookiebotOnLoad', handler as any);
    window.removeEventListener('OneTrustGroupsUpdated', handler as any);
    window.removeEventListener('egg:consent_update', handler as any);
  };
}
