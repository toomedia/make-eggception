import type { AttributionFields } from './types';
import { supabase } from '@/lib/supabase';

export const ATTRIBUTION_STORAGE_KEY = 'egg_attribution_v1';
const ATTRIBUTION_TTL_DAYS = 90;
const ATTRIBUTION_TTL_MS = ATTRIBUTION_TTL_DAYS * 24 * 60 * 60 * 1000;

type StoredAttribution = {
  v: 1;
  attribution_id: string;
  utm: Omit<AttributionFields, 'referrer'>;
  referrer?: string;
  first_seen_at: string;
  last_seen_at: string;
  first_touch_sent?: boolean;
};

function nowIso(): string {
  return new Date().toISOString();
}

function sanitizeReferrer(referrer: string): string | undefined {
  if (!referrer) return undefined;
  try {
    return new URL(referrer).hostname || undefined;
  } catch {
    return undefined;
  }
}

function pickUtmFromSearch(searchParams: URLSearchParams): StoredAttribution['utm'] {
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
  const utm: Record<string, string> = {};
  for (const key of keys) {
    const value = searchParams.get(key);
    if (value) utm[key] = value;
  }
  return utm as StoredAttribution['utm'];
}

function safeReadStored(): StoredAttribution | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage?.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as StoredAttribution;
    if (!parsed || parsed.v !== 1) return undefined;
    if (typeof parsed.attribution_id !== 'string') return undefined;
    const lastSeen = Date.parse(parsed.last_seen_at || parsed.first_seen_at);
    if (!Number.isFinite(lastSeen) || Date.now() - lastSeen > ATTRIBUTION_TTL_MS) {
      window.localStorage?.removeItem(ATTRIBUTION_STORAGE_KEY);
      return undefined;
    }
    return parsed;
  } catch {
    return undefined;
  }
}

function safeWriteStored(value: StoredAttribution): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage?.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function getOrCreateAttributionId(existing?: string): string {
  if (existing) return existing;
  const cryptoAny = globalThis.crypto as any;
  if (cryptoAny?.randomUUID) return cryptoAny.randomUUID();
  return `attr_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function getAttributionForEvents(): AttributionFields {
  const stored = safeReadStored();
  if (stored) {
    return {
      ...stored.utm,
      referrer: stored.referrer,
    };
  }

  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utm = pickUtmFromSearch(params);
  const referrer = sanitizeReferrer(document.referrer || '');
  return { ...utm, referrer };
}

export function captureAttributionFromWindow(options: { persist: boolean }): StoredAttribution | undefined {
  if (typeof window === 'undefined') return undefined;

  const stored = safeReadStored();
  const params = new URLSearchParams(window.location.search);
  const utm = pickUtmFromSearch(params);
  const referrer = sanitizeReferrer(document.referrer || '');

  const timestamp = nowIso();
  const next: StoredAttribution = {
    v: 1,
    attribution_id: getOrCreateAttributionId(stored?.attribution_id),
    utm: Object.keys(stored?.utm ?? {}).length ? (stored!.utm as any) : utm,
    referrer: stored?.referrer ?? referrer,
    first_seen_at: stored?.first_seen_at ?? timestamp,
    last_seen_at: timestamp,
    first_touch_sent: stored?.first_touch_sent,
  };

  if (options.persist) {
    safeWriteStored(next);
    console.info('[Attribution] stored first-touch data', {
      attribution_id: next.attribution_id,
      utm: next.utm,
      referrer: next.referrer,
    });
  } else {
    console.info('[Attribution] capture skipped (persist=false)');
  }
  return next;
}

export function appendAttributionToUrl(url: string): string {
  const fields = getAttributionForEvents();
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

  try {
    const u = new URL(url);
    for (const key of utmKeys) {
      const value = (fields as any)[key] as string | undefined;
      if (!value) continue;
      if (!u.searchParams.get(key)) u.searchParams.set(key, value);
    }
    return u.toString();
  } catch {
    return url;
  }
}

export function sanitizeDestination(url: string): string {
  try {
    const u = new URL(url);
    return `${u.origin}${u.pathname}`;
  } catch {
    return url.split('?')[0]?.split('#')[0] ?? url;
  }
}

export async function writeFirstTouchOnceIfAllowed(options: { persistAllowed: boolean }): Promise<void> {
  if (!options.persistAllowed) return;
  if (typeof window === 'undefined') return;

  const stored = safeReadStored();
  if (!stored) {
    console.info('[Attribution] no stored data; skip insert');
    return;
  }
  if (stored.first_touch_sent) {
    console.info('[Attribution] already sent; skip insert', { attribution_id: stored.attribution_id });
    return;
  }

  const record = {
    utm_source: stored.utm.utm_source,
    utm_medium: stored.utm.utm_medium,
    utm_campaign: stored.utm.utm_campaign,
    utm_content: stored.utm.utm_content,
    utm_term: stored.utm.utm_term,
    landing_path: window.location.pathname,
    referrer: stored.referrer,
    captured_at: stored.first_seen_at,
    attribution_id: stored.attribution_id,
  };

  try {
    const { error } = await supabase
      .from('utm_tracking')
      .upsert(record, { onConflict: 'attribution_id', ignoreDuplicates: true });
    if (error) {
      console.warn('[Attribution] insert failed', { message: error.message });
      return;
    }
    safeWriteStored({ ...stored, first_touch_sent: true, last_seen_at: nowIso() });
    console.info('[Attribution] insert ok', { attribution_id: stored.attribution_id });
  } catch {
    // ignore
    console.warn('[Attribution] insert threw error');
  }
}
