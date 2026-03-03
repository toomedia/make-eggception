'use client';

import { useEffect, useState } from 'react';
import useTranslation from '@/lib/useTranslation';
import { useConsent } from '@/components/ConsentContext';

const ConsentBanner = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const { consent, setConsent } = useConsent();

  useEffect(() => {
    setIsVisible(!consent);
  }, [consent]);

  const handleAccept = () => {
    setConsent({ v: 1, analytics: true, marketing: false, source: 'funnel_banner', ts: new Date().toISOString() });
    setIsVisible(false);
  };

  const handleDecline = () => {
    setConsent({ v: 1, analytics: false, marketing: false, source: 'funnel_banner', ts: new Date().toISOString() });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="text-sm text-[var(--text-primary)]">
          <div className="font-semibold">
            {t.consent?.title || 'Cookies & Analytics'}
          </div>
          <div className="text-[var(--text-secondary)]">
            {t.consent?.description ||
              'We use analytics cookies to improve the experience. You can accept or decline.'}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDecline}
            className="px-4 py-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors text-sm"
          >
            {t.consent?.decline || 'Decline'}
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2"
          >
            {t.consent?.accept || 'Accept'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
