'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { persistConsent, readConsentCookieValue, type ConsentCookieValue, readConsent } from '@/lib/egg-analytics/consent';

type ConsentValue = null | ConsentCookieValue;

type ConsentContextValue = {
  consent: ConsentValue;
  setConsent: (next: ConsentCookieValue) => void;
  ready: boolean;
};

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

const SESSION_KEY = 'egg_funnel_consent_session_v1';

export function ConsentProvider(props: { children: React.ReactNode }) {
  const [consent, setConsentState] = useState<ConsentValue>(null);

  const initial = useMemo(() => readConsent(), []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cookieValue = readConsentCookieValue();
    if (cookieValue) {
      setConsentState(cookieValue);
      return;
    }

    try {
      const raw = window.sessionStorage?.getItem(SESSION_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ConsentValue;
      if (!parsed || typeof parsed !== 'object' || (parsed as any).v !== 1) return;
      if (typeof (parsed as any).analytics !== 'boolean' || typeof (parsed as any).marketing !== 'boolean') return;
      if (typeof (parsed as any).source !== 'string') return;
      const rawTs = (parsed as any).ts;
      const ts =
        typeof rawTs === 'string'
          ? rawTs
          : typeof rawTs === 'number'
            ? new Date(rawTs).toISOString()
            : null;
      if (!ts) return;

      setConsentState({
        v: 1,
        analytics: (parsed as any).analytics,
        marketing: (parsed as any).marketing,
        source: (parsed as any).source,
        ts,
      });
    } catch {
      // ignore
    }
  }, [initial.analytics, initial.marketing, initial.source, initial.status]);

  const setConsent = (next: ConsentCookieValue) => {
    const normalized: ConsentCookieValue = {
      v: 1,
      analytics: Boolean(next.analytics),
      marketing: Boolean(next.marketing),
      source: next.source || 'funnel_banner',
      ts: new Date().toISOString(),
    };

    setConsentState(normalized);

    try {
      window.sessionStorage?.setItem(SESSION_KEY, JSON.stringify(normalized));
    } catch {
      // ignore
    }

    persistConsent({ analytics: normalized.analytics, marketing: normalized.marketing, source: normalized.source });

    window.dispatchEvent(new CustomEvent('egg:consent_update'));
  };

  return <ConsentContext.Provider value={{ consent, setConsent, ready: true }}>{props.children}</ConsentContext.Provider>;
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used within ConsentProvider');
  return ctx;
}
