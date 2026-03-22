import { useLanguage } from '@/lib/LanguageContext';

type ConsentStrings = {
  title: string;
  description: string;
  accept: string;
  decline: string;
};

export default function useTranslation(): { t: { consent?: ConsentStrings } } {
  const { language } = useLanguage();

  const consent =
    language === 'de'
      ? {
          title: 'Datenschutz-Einstellungen',
          description: 'Erlaube Spielanalyse, damit wir die Experience verbessern können. Marketing bleibt optional.',
          accept: 'Tracking erlauben',
          decline: 'Ablehnen',
        }
      : {
          title: 'Privacy settings',
          description: 'Allow gameplay analytics to help us improve the experience. Marketing stays optional.',
          accept: 'Allow tracking',
          decline: 'Decline',
        };

  return { t: { consent } };
}
