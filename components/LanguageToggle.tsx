'use client';

import { Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';


export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'de' ? 'en' : 'de');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="h-9 px-3 text-foreground hover:bg-accent bg-background/80 backdrop-blur-md border border-border"
    >
      <Languages className="h-4 w-4 mr-2" />
      <span className="uppercase font-medium">{language}</span>
    </Button>
  );
}
