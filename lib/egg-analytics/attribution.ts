import type { AttributionFields } from './types';
import { supabase } from '@/lib/supabase';

// TypeScript declaration for debug function
declare global {
  interface Window {
    checkUtmInTable: () => Promise<void>;
    forceWriteUtmToTable: () => Promise<void>;
  }
}


if (typeof window !== 'undefined') {
window.forceWriteUtmToTable = async function() {
  const stored = safeReadStored();
  if (!stored) {
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
  
  
  const { error } = await supabase
    .from('utm_tracking')
    .upsert(record, { onConflict: 'attribution_id', ignoreDuplicates: true });
  
  if (error) {
    return;
  }
  
  // Update localStorage
  stored.first_touch_sent = true;
  stored.last_seen_at = nowIso();
  safeWriteStored(stored);
};

window.checkUtmInTable = async function() {
  const stored = safeReadStored();
  if (!stored) {
    return;
  }
  
  const { data, error } = await supabase
    .from('utm_tracking')
    .select('*')
    .eq('attribution_id', stored.attribution_id);
  
  if (error) {
    return;
  }
  
  if (data && data.length > 0) {
  } else {
  }
};
}

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
    if (!raw) {
      return undefined;
    }
    const parsed = JSON.parse(raw) as StoredAttribution;
    if (!parsed || parsed.v !== 1) {
      return undefined;
    }
    if (typeof parsed.attribution_id !== 'string') {
      return undefined;
    }
    const lastSeen = Date.parse(parsed.last_seen_at || parsed.first_seen_at);
    if (!Number.isFinite(lastSeen) || Date.now() - lastSeen > ATTRIBUTION_TTL_MS) {
      window.localStorage?.removeItem(ATTRIBUTION_STORAGE_KEY);
      return undefined;
    }
    return parsed;
  } catch (e) {
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

  console.info('[UTM Tracking] Capturing UTM from URL:', { utm, referrer, hasExisting: !!stored });

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
    console.info('[UTM Tracking] Stored in localStorage:', {
      attribution_id: next.attribution_id,
      utm: next.utm,
      referrer: next.referrer,
      first_seen_at: next.first_seen_at,
    });
  } else {
    console.info('[UTM Tracking] Capture skipped (persist=false)');
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
  if (!options.persistAllowed) {
    console.info('[UTM Tracking] persist not allowed, skipping...');
    return;
  }
  if (typeof window === 'undefined') return;

  const stored = safeReadStored();
  if (!stored) {
    console.info('[UTM Tracking] No stored data found in localStorage');
    return;
  }
  if (stored.first_touch_sent) {
    console.info('[UTM Tracking] Already sent to table, skipping', { attribution_id: stored.attribution_id });
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

  console.info('[UTM Tracking]  Preparing to save to database...', record);

  try {
    const { error, data } = await supabase
      .from('utm_tracking')
      .upsert(record, { onConflict: 'attribution_id', ignoreDuplicates: true });
    
    if (error) {
      console.error('[UTM Tracking]  FAILED to save to table:', { 
        message: error.message, 
        details: error.details,
        hint: error.hint,
        record: record
      });
      return;
    }
    
    console.info('[UTM Tracking]  SUCCESS! Data saved to utm_tracking table:', record);
    safeWriteStored({ ...stored, first_touch_sent: true, last_seen_at: nowIso() });
  } catch (err) {
  }
}
