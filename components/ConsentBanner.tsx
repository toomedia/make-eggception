"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { useConsent } from "./ConsentContext";
import { PrivacyChip } from "./PrivacyChip";
import { Step1Banner } from "./Step1Banner";
import { Step2Preferences } from "./Step2Preferences";
import { ConsentToast } from "./ConsentToast";
import { ConsentState, ConsentStep, DEFAULT_CONSENT } from "./types";
import { Locale, t } from "@/constants/consent";

const ALL: ConsentState = { analytics: true, replay: true, marketing: true };
const ANALYTICS_ONLY: ConsentState = { analytics: true, replay: true, marketing: false };
const NONE: ConsentState = { analytics: false, replay: false, marketing: false };

function buildToastMessage(state: ConsentState, locale: Locale): string {
  const copy = t(locale);
  const parts: string[] = [];
  parts.push(state.analytics ? copy.toast.analyticsOn : copy.toast.analyticsOff);
  parts.push(state.marketing ? copy.toast.marketingOn : copy.toast.marketingOff);
  return `${copy.toast.saved}: ${parts.join(" · ")}`;
}

function normalizeDraft(state: ConsentState): ConsentState {
  const analytics = state.analytics || state.replay;
  const replay = analytics ? state.replay : false;
  return {
    analytics,
    replay,
    marketing: state.marketing,
  };
}

export function ConsentBanner() {
  const { language } = useLanguage();
  const { consent, setConsent, ready } = useConsent();
  const locale: Locale = language === "de" ? "de" : "en";
  const [step, setStep] = useState<ConsentStep | null>(null);
  const [showStep3, setShowStep3] = useState(false);
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState<ConsentState>(DEFAULT_CONSENT);
  const [toast, setToast] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const copy = t(locale);

  const requiresDecision = ready && !consent;

  useEffect(() => {
    if (!ready) return;

    if (consent) {
      setDraft({
        analytics: consent.analytics,
        replay: consent.analytics,
        marketing: consent.marketing,
      });
      setSaved(true);
      return;
    }

    setDraft(DEFAULT_CONSENT);
    setSaved(false);
  }, [consent, ready]);

  useEffect(() => {
    if (!ready) return;

    if (requiresDecision) {
      setStep((prev) => prev ?? 1);
      return;
    }

    if (!showStep3 && step === 1) {
      setStep(null);
    }
  }, [ready, requiresDecision, showStep3, step]);

  useEffect(() => {
    if (step === null) return;
    const el = modalRef.current;
    if (!el) return;

    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const handler = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || focusable.length === 0) return;

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [step]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showStep3) {
        setShowStep3(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showStep3]);

  useEffect(() => {
    const openPreferences = () => {
      setShowStep3(false);
      setStep(2);
    };

    window.addEventListener("openConsentPreferences", openPreferences);
    return () => window.removeEventListener("openConsentPreferences", openPreferences);
  }, []);

  const commit = useCallback(
    (state: ConsentState, source: string) => {
      const normalized = normalizeDraft(state);

      setConsent({
        v: 1,
        analytics: normalized.analytics,
        marketing: normalized.marketing,
        source,
        ts: new Date().toISOString(),
      });

      setDraft(normalized);
      setSaved(true);
      setStep(null);
      setShowStep3(false);
      setToast(buildToastMessage(normalized, locale));
    },
    [locale, setConsent]
  );

  const closePreferences = () => {
    setShowStep3(false);

    if (!saved) {
      commit(NONE, "gate_dismiss");
      return;
    }

    setDraft({
      analytics: consent?.analytics ?? false,
      replay: consent?.analytics ?? false,
      marketing: consent?.marketing ?? false,
    });
    setStep(null);
  };

  if (!ready) return null;
  if (step === null && !saved) return null;

  return (
    <>
      {step !== null && (
        <>
          <div
            className="animate-backdrop-in fixed inset-0 z-[80] flex items-end justify-center md:items-center"
            style={{ background: "hsl(var(--consent-navy) / 0.48)", backdropFilter: "blur(8px)" }}
            aria-hidden="true"
          />
          <div
            className="fixed inset-0 z-[80] flex items-end justify-center md:items-center pointer-events-none p-3 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Privacy settings"
          >
            <div
              ref={modalRef}
              className={`
                pointer-events-auto w-full md:max-w-[620px]
                ${step === 1 ? "animate-sheet-in md:animate-consent-in" : "animate-consent-in"}
                max-h-[90dvh] overflow-y-auto
              `}
            >
              {step === 1 && (
                <Step1Banner
                  locale={locale}
                  onAllowAnalytics={() => commit(ANALYTICS_ONLY, "gate_accept_analytics")}
                  onNecessaryOnly={() => commit(NONE, "gate_reject_all")}
                  onCustomize={() => setStep(2)}
                />
              )}

              {step === 2 && (
                <Step2Preferences
                  locale={locale}
                  state={draft}
                  onChange={(next) => setDraft(normalizeDraft(next))}
                  onSave={() => commit(draft, saved ? "preferences" : "gate_customize")}
                  onAllowAll={() => commit(ALL, "preferences_allow_all")}
                  onNecessaryOnly={() => commit(NONE, "preferences_necessary_only")}
                  onViewDetails={() => setShowStep3(true)}
                  onClose={closePreferences}
                  detailsOpen={showStep3}
                  onCloseDetails={() => setShowStep3(false)}
                />
              )}

            </div>
          </div>
        </>
      )}

      {saved && step === null && !showStep3 && (
        <PrivacyChip label={copy.privacyChip} onClick={() => setStep(2)} />
      )}

      {toast && <ConsentToast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}

export default ConsentBanner;
