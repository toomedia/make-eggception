import type { AnalyticsProvider } from '../provider';
import type { CanonicalEventName, EventMap } from '../types';

type FbqFn = (...args: any[]) => void;

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

async function ensureFbqReady(pixelId: string): Promise<FbqFn | undefined> {
  if (typeof window === 'undefined') return undefined;
  const existing = (window as any).fbq as FbqFn | undefined;
  if (existing) return existing;

  // Standard FB Pixel bootstrap (minimal). Loading after consent only.
  (window as any).fbq = function (...args: any[]) {
    ((window as any).fbq.q = (window as any).fbq.q || []).push(args);
  };
  (window as any).fbq.push = (window as any).fbq;
  (window as any).fbq.loaded = true;
  (window as any).fbq.version = '2.0';
  (window as any).fbq.queue = [];

  await loadScriptOnce('https://connect.facebook.net/en_US/fbevents.js', 'egg-fb-pixel');
  const fbq = (window as any).fbq as FbqFn;
  fbq('init', pixelId);
  return fbq;
}

export function createFBPixelProvider(): AnalyticsProvider | null {
  const pixelId =
    process.env.NEXT_PUBLIC_FB_PIXEL_ID ||
    process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  if (!pixelId) return null;

  let fbq: FbqFn | undefined;
  const pending: Array<{ t: number; e: CanonicalEventName; p: any }> = [];

  function flush() {
    const now = Date.now();
    const maxAgeMs = 2_000;
    const keep = pending.filter((x) => now - x.t <= maxAgeMs);
    pending.length = 0;
    for (const item of keep) {
      fbq?.('trackCustom', item.e, item.p);
    }
  }

  return {
    name: 'fbpixel',
    category: 'marketing',
    async init() {
      if (fbq) return;
      try {
        fbq = await ensureFbqReady(pixelId);
        flush();
      } catch {
        // tolerate missing network/scripts
      }
    },
    track<E extends CanonicalEventName>(event: E, props: EventMap[E]) {
      if (event !== 'cta_click') return;
      if (!fbq) {
        pending.push({ t: Date.now(), e: event, p: props });
        if (pending.length > 50) pending.splice(0, pending.length - 50);
        return;
      }
      fbq('trackCustom', event, props);
    },
  };
}
