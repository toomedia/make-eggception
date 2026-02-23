import { setConsent } from '@/lib/egg-analytics';
import { readConsent } from '@/lib/egg-analytics/consent';

export async function initializePostHog(): Promise<void> {
  // Bootstrap (providers init + canonical events) is handled in AnalyticsBootstrap.
  // We just nudge it after banner acceptance.
  const consent = readConsent();
  setConsent(consent);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('egg:consent_update'));
  }
}

export async function trackPostHogEvent(_name: string, _props?: Record<string, any>): Promise<void> {
  // Intentionally a no-op to keep the system canonical:
  // consent_update is emitted by AnalyticsBootstrap once per change.
}

