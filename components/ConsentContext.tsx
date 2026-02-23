'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearPersistedConsent, persistConsentIfAccepted, readConsent } from '@/lib/egg-analytics/consent';

type ConsentValue = null | { analytics: boolean; updatedAt: number };

type ConsentContextValue = {
  consent: ConsentValue;
  setConsent: (next: { analytics: boolean; updatedAt: number }) => void;
};

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

const SESSION_KEY = 'egg_funnel_consent_session_v1';

export function ConsentProvider(props: { children: React.ReactNode }) {
  const [consent, setConsentState] = useState<ConsentValue>(null);

  const initial = useMemo(() => readConsent(), []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // If user already accepted (cookie), treat as consent given.
    if (initial.analytics || initial.marketing) {
      setConsentState({ analytics: true, updatedAt: Date.now() });
      return;
    }

    // Otherwise, restore in-session decision (so we don't keep showing banner on every reload in the funnel).
    try {
      const raw = window.sessionStorage?.getItem(SESSION_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ConsentValue;
      if (parsed && typeof parsed === 'object' && typeof (parsed as any).analytics === 'boolean') {
        setConsentState(parsed);
      }
    } catch {
      // ignore
    }
  }, [initial.analytics, initial.marketing]);

  const setConsent = (next: { analytics: boolean; updatedAt: number }) => {
    setConsentState(next);

    try {
      window.sessionStorage?.setItem(SESSION_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }

    if (next.analytics) {
      persistConsentIfAccepted({ analytics: true, marketing: false });
    } else {
      // Decline should not persist a cross-site "deny", but should remove any prior accept.
      clearPersistedConsent();
    }

    window.dispatchEvent(new CustomEvent('egg:consent_update'));
  };

  return <ConsentContext.Provider value={{ consent, setConsent }}>{props.children}</ConsentContext.Provider>;
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used within ConsentProvider');
  return ctx;
}

