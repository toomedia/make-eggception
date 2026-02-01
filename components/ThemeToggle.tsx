'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center w-9 h-9 rounded-md text-foreground hover:bg-accent bg-background/80 backdrop-blur-md border border-border transition-all duration-200"
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 text-foreground" strokeWidth={2.5} />
      ) : (
        <Sun className="w-4 h-4 text-foreground" strokeWidth={2.5} />
      )}
    </button>
  );
}
