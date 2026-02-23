import type { AnalyticsProvider } from './provider';
import type { CanonicalEventName, EggApp, EventMap } from './types';
import type { ConsentState } from './consent';
import { getAttributionForEvents, appendAttributionToUrl, sanitizeDestination } from './attribution';
import { createPostHogProvider } from './providers/posthog';
import { createGAProvider } from './providers/ga';
import { createFBPixelProvider } from './providers/fbpixel';

type TrackingContext = {
  app: EggApp;
  variant: string;
};

let context: TrackingContext | null = null;
let consent: ConsentState = { analytics: false, marketing: false, source: 'unknown', status: 'unknown' };
let providers: AnalyticsProvider[] = [];
let initializedCategories: { analytics: boolean; marketing: boolean } = { analytics: false, marketing: false };

function ensureContext(): TrackingContext {
  if (!context) {
    context = {
      app: (process.env.NEXT_PUBLIC_EGG_APP as EggApp) || 'make',
      variant: process.env.NEXT_PUBLIC_EGG_VARIANT || 'unknown',
    };
  }
  return context;
}

function baseProps(): Pick<EventMap['funnel_view'], 'app' | 'variant' | 'path'> {
  const ctx = ensureContext();
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  return { app: ctx.app, variant: ctx.variant, path };
}

function buildProps<E extends CanonicalEventName>(event: E, props: Partial<EventMap[E]>): EventMap[E] {
  const attribution = getAttributionForEvents();
  const base = baseProps();
  return { ...attribution, ...base, ...(props as any) } as EventMap[E];
}

function getProvidersForEvent(event: CanonicalEventName): AnalyticsProvider[] {
  const list: AnalyticsProvider[] = [];
  if (consent.analytics) list.push(...providers.filter((p) => p.category === 'analytics'));
  if (consent.marketing) list.push(...providers.filter((p) => p.category === 'marketing'));

  // Marketing only receives CTA clicks in the FB adapter; analytics receives all.
  return list;
}

async function initCategory(category: 'analytics' | 'marketing'): Promise<void> {
  if (initializedCategories[category]) return;
  initializedCategories = { ...initializedCategories, [category]: true };
  const targets = providers.filter((p) => p.category === category);
  await Promise.allSettled(targets.map((p) => Promise.resolve(p.init())));
}

export async function initAnalytics(options: { app: EggApp; variant: string; consent: ConsentState }): Promise<void> {
  if (typeof window === 'undefined') return;

  context = { app: options.app, variant: options.variant };
  consent = options.consent;

  if (!providers.length) {
    const ga = createGAProvider();
    const fb = createFBPixelProvider();
    providers = [createPostHogProvider(), ...(ga ? [ga] : []), ...(fb ? [fb] : [])];
  }

  if (consent.analytics) await initCategory('analytics');
  if (consent.marketing) await initCategory('marketing');
}

export function setConsent(next: ConsentState): void {
  consent = next;
}

export function track<E extends CanonicalEventName>(event: E, props?: Partial<EventMap[E]>): void {
  if (typeof window === 'undefined') return;
  if (!consent.analytics && !consent.marketing) return;

  const finalProps = buildProps(event, props ?? {});
  for (const provider of getProvidersForEvent(event)) {
    try {
      provider.track(event, finalProps as any);
    } catch {
      // ignore provider errors
    }
  }
}

export function trackAndRedirect(options: {
  cta_id: string;
  href: string;
  position?: string;
  delayMs?: number;
}): void {
  if (typeof window === 'undefined') return;

  const destination = sanitizeDestination(options.href);
  const delayMs =
    consent.analytics || consent.marketing ? (options.delayMs ?? 120) : 0;

  track('cta_click', {
    cta_id: options.cta_id,
    destination,
    position: options.position,
  } as any);

  const withAttribution = appendAttributionToUrl(options.href);
  window.setTimeout(() => {
    window.location.href = withAttribution;
  }, delayMs);
}

export function getConsentState(): ConsentState {
  return consent;
}

