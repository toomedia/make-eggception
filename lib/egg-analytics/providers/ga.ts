import type { AnalyticsProvider } from '../provider';
import type { CanonicalEventName, EventMap } from '../types';

type GtagFn = (...args: any[]) => void;

function loadScriptOnce(src: string, id: string): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();
  if (document.getElementById(id)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = id;
    script.async = true;
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

async function ensureGtagReady(measurementId: string): Promise<GtagFn | undefined> {
  if (typeof window === 'undefined') return undefined;
  const existing = (window as any).gtag as GtagFn | undefined;
  if (existing) return existing;

  await loadScriptOnce(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`, 'egg-gtag-js');

  (window as any).dataLayer = (window as any).dataLayer || [];
  const gtag: GtagFn = (...args: any[]) => (window as any).dataLayer.push(args);
  (window as any).gtag = gtag;

  gtag('js', new Date());
  gtag('config', measurementId, { send_page_view: false });
  return gtag;
}

export function createGAProvider(): AnalyticsProvider | null {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) return null;

  let gtag: GtagFn | undefined;
  let readyAt = 0;
  const pending: Array<{ t: number; e: CanonicalEventName; p: any }> = [];

  function flush() {
    const now = Date.now();
    const maxAgeMs = 2_000;
    const keep = pending.filter((x) => now - x.t <= maxAgeMs);
    pending.length = 0;
    for (const item of keep) {
      gtag?.('event', item.e, item.p);
    }
  }

  return {
    name: 'ga',
    category: 'analytics',
    async init() {
      if (gtag) return;
      try {
        gtag = await ensureGtagReady(measurementId);
        readyAt = Date.now();
        flush();
      } catch {
        // tolerate missing network/scripts
      }
    },
    track<E extends CanonicalEventName>(event: E, props: EventMap[E]) {
      const now = Date.now();
      if (!gtag) {
        pending.push({ t: now, e: event, p: props });
        // Drop stale queue even if init never happens.
        if (pending.length > 50) pending.splice(0, pending.length - 50);
        return;
      }
      // Avoid sending very old queued events.
      if (readyAt && now - readyAt > 60_000) return;
      gtag('event', event, props);
    },
  };
}

