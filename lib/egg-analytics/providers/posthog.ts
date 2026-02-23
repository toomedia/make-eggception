import type { AnalyticsProvider } from '../provider';
import type { CanonicalEventName, EventMap } from '../types';

type PosthogCaptureFn = (event: string, props?: any) => void;

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

function isReady(): boolean {
  const ph = (globalThis as any).posthog;
  return Boolean(ph?.__loaded) || typeof ph?.capture === 'function';
}

function ensurePostHogStub() {
  const anyGlobal = globalThis as any;
  const existing = anyGlobal.posthog;
  if (existing?.capture) return;

  const queue: any[] = Array.isArray(existing) ? existing : [];
  const posthog: any = queue;
  posthog._i = posthog._i || [];
  posthog.__loaded = false;
  posthog.capture = (...args: any[]) => posthog.push(['capture', ...args]);
  posthog.init = (key: string, config: any) => {
    posthog._i.push([key, config]);
  };
  anyGlobal.posthog = posthog;
}

export function createPostHogProvider(): AnalyticsProvider {
  let initialized = false;

  return {
    name: 'posthog',
    category: 'analytics',
    async init() {
      if (initialized) return;
      initialized = true;

      // Align with play.eggception: load via PostHog array.js after consent.
      const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
      if (!posthogKey) return;

      if (!isReady()) ensurePostHogStub();
      (globalThis as any).posthog.init(posthogKey, {
        api_host: posthogHost,
        cross_subdomain_cookie: true,
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
        disable_session_recording: true,
      });

      const hostNoSlash = posthogHost.replace(/\/$/, '');
      await loadScriptOnce(`${hostNoSlash}/static/array.js`, 'egg-posthog-js');
      (globalThis as any).posthog.__loaded = true;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('posthog:loaded'));
      }
    },
    track<E extends CanonicalEventName>(event: E, props: EventMap[E]) {
      const ph = (globalThis as any).posthog as { capture?: PosthogCaptureFn } | undefined;
      if (!ph?.capture) return;
      ph.capture(event, props);
    },
  };
}
