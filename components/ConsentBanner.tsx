"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { useConsent } from "./ConsentContext";
import { Step1Banner } from "./Step1Banner";
import { Step2Preferences } from "./Step2Preferences";
import { Step3Details } from "./StepDetails";
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
  const [locale, setLocale] = useState<Locale>(language === "de" ? "de" : "en");
  const [step, setStep] = useState<ConsentStep | null>(null);
  const [showStep3, setShowStep3] = useState(false);
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState<ConsentState>(DEFAULT_CONSENT);
  const [toast, setToast] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const requiresDecision = ready && !consent;

  const releaseConsentGateShell = () => {
    const consentGateShell = document.getElementById("consent-gate-shell") as HTMLDialogElement | null;
    if (consentGateShell?.open) {
      consentGateShell.close();
    }
    consentGateShell?.remove();
  };

  const setAppShellBlocked = (blocked: boolean) => {
    const consentAppShell = document.getElementById("consent-app-shell");
    if (!consentAppShell) return;

    try {
      (consentAppShell as HTMLElement & { inert?: boolean }).inert = blocked;
    } catch {
      // Ignore inert property assignment issues and fall back to attributes/styles.
    }

    if (blocked) {
      consentAppShell.setAttribute("inert", "");
      consentAppShell.setAttribute("aria-hidden", "true");
      consentAppShell.style.pointerEvents = "none";
      consentAppShell.style.userSelect = "none";
    } else {
      consentAppShell.removeAttribute("inert");
      consentAppShell.removeAttribute("aria-hidden");
      consentAppShell.style.pointerEvents = "";
      consentAppShell.style.userSelect = "";
    }
  };

  useEffect(() => {
    setLocale(language === "de" ? "de" : "en");
  }, [language]);

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
      setAppShellBlocked(true);
      const frameId = window.requestAnimationFrame(() => {
        releaseConsentGateShell();
      });
      return () => window.cancelAnimationFrame(frameId);
    }

    setAppShellBlocked(false);
    releaseConsentGateShell();

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
      setAppShellBlocked(false);
      releaseConsentGateShell();
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
      setAppShellBlocked(false);
      releaseConsentGateShell();
    },
    [locale, setConsent]
  );

  if (!ready) return null;
  if (step === null && !saved) return null;

  return (
    <>
      {step !== null && (
        <>
          <div
            className="animate-backdrop-in fixed inset-0 z-50 flex items-end justify-center md:items-center"
            style={{ background: "hsl(var(--consent-navy) / 0.55)", backdropFilter: "blur(4px)" }}
            aria-hidden="true"
          />
          <div
            className="fixed inset-0 z-50 flex items-end justify-center md:items-center pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-label="Privacy settings"
          >
            <div
              ref={modalRef}
              className={`
                pointer-events-auto w-full md:max-w-[640px]
                rounded-t-3xl md:rounded-3xl
                px-5 py-6 md:p-8
                ${step === 1 ? "animate-sheet-in md:animate-consent-in" : "animate-consent-in"}
                max-h-[90dvh] overflow-y-auto
              `}
              style={{
                background: "var(--consent-surface)",
                border: "1px solid hsl(var(--consent-border))",
                boxShadow: "0 24px 64px hsl(var(--consent-navy) / 0.22)",
              }}
            >
              <div
                className="w-10 h-1 rounded-full mx-auto mb-5 md:hidden"
                style={{ background: "hsl(var(--consent-border))" }}
                aria-hidden="true"
              />

              {step === 1 && (
                <Step1Banner
                  locale={locale}
                  onAllowAnalytics={() => commit(ANALYTICS_ONLY, "gate_accept_analytics")}
                  onNecessaryOnly={() => commit(NONE, "gate_reject_all")}
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
                  onBack={() => setStep(saved ? null : 1)}
                />
              )}

            </div>
          </div>
        </>
      )}

      {showStep3 && <Step3Details locale={locale} onClose={() => setShowStep3(false)} />}

      {/* {saved && step === null && !showStep3 && (
        <PrivacyChip label={copy.privacyChip} onClick={() => setStep(2)} />
      )} */}

      {toast && <ConsentToast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}

export default ConsentBanner;
