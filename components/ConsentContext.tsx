'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { persistConsent, readConsentCookieValue, type ConsentCookieValue, readConsent } from '@/lib/egg-analytics/consent';

type ConsentValue = null | ConsentCookieValue;

type ConsentContextValue = {
  consent: ConsentValue;
  setConsent: (next: ConsentCookieValue) => void;
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

    // Otherwise, restore in-session decision (so we don't keep showing banner on every reload in the funnel).
    try {
      const raw = window.sessionStorage?.getItem(SESSION_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ConsentValue;
      if (
        parsed &&
        typeof parsed === 'object' &&
        (parsed as any).v === 1 &&
        typeof (parsed as any).analytics === 'boolean' &&
        typeof (parsed as any).marketing === 'boolean' &&
        typeof (parsed as any).source === 'string' &&
        typeof (parsed as any).ts === 'number'
      ) {
        setConsentState(parsed);
      }
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

    // Requirement: persist on accept OR decline (cross-subdomain cookie).
    persistConsent({ analytics: normalized.analytics, marketing: normalized.marketing, source: normalized.source });

    window.dispatchEvent(new CustomEvent('egg:consent_update'));
  };

  return <ConsentContext.Provider value={{ consent, setConsent }}>{props.children}</ConsentContext.Provider>;
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used within ConsentProvider');
  return ctx;
}
