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
          title: 'Cookies & Analytics',
          description: 'Wir nutzen Analyse-Cookies, um die Experience zu verbessern. Du kannst akzeptieren oder ablehnen.',
          accept: 'Akzeptieren',
          decline: 'Ablehnen',
        }
      : {
          title: 'Cookies & Analytics',
          description: 'We use analytics cookies to improve the experience. You can accept or decline.',
          accept: 'Accept',
          decline: 'Decline',
        };

  return { t: { consent } };
}

