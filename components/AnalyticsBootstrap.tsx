'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import type { EggApp } from '@/lib/egg-analytics/types';
import { captureAttributionFromWindow, writeFirstTouchOnceIfAllowed } from '@/lib/egg-analytics/attribution';
import { onConsentChange, readConsent, type ConsentState } from '@/lib/egg-analytics/consent';
import { initAnalytics, setConsent, track } from '@/lib/egg-analytics';

export function AnalyticsBootstrap(props: { app: EggApp; variant: string }) {
  const pathname = usePathname();
  const pathRef = useRef(pathname || '/');
  const lastConsentRef = useRef<ConsentState | null>(null);
  const funnelViewSentRef = useRef(false);

  useEffect(() => {
    pathRef.current = pathname || '/';
  }, [pathname]);

  useEffect(() => {
    let mounted = true;

    async function applyConsent(next: ConsentState) {
      if (!mounted) return;
      const prev = lastConsentRef.current;
      const changed = !prev || prev.analytics !== next.analytics || prev.marketing !== next.marketing;
      lastConsentRef.current = next;
      const wasAllowed = Boolean(prev?.analytics || prev?.marketing);
      const isAllowed = Boolean(next.analytics || next.marketing);

      if (changed && wasAllowed) {
        track('consent_update', {
          analytics: next.analytics,
          marketing: next.marketing,
          source: next.source,
          path: pathRef.current,
        } as any);
      }

      setConsent(next);

      const persistAllowed = isAllowed;
      captureAttributionFromWindow({ persist: persistAllowed });

      await initAnalytics({ app: props.app, variant: props.variant, consent: next });

      if (persistAllowed) {
        await writeFirstTouchOnceIfAllowed({ persistAllowed: true });
      }

      if (changed && persistAllowed && !wasAllowed) {
        track('consent_update', {
          analytics: next.analytics,
          marketing: next.marketing,
          source: next.source,
          path: pathRef.current,
        } as any);
      }

      if (!funnelViewSentRef.current && next.analytics) {
        funnelViewSentRef.current = true;
        track('funnel_view', { path: pathRef.current } as any);
      }
    }

    void applyConsent(readConsent());
    const unsubscribe = onConsentChange((next) => void applyConsent(next));

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [props.app, props.variant]);

  return null;
}
