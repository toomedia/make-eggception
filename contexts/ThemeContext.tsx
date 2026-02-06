'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function readThemeCookie(): Theme | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(/(?:^|; )theme=([^;]+)/);
  const value = match?.[1];

  if (value === 'light' || value === 'dark') return value;
  return null;
}

function writeThemeCookie(theme: Theme) {
  if (typeof document === 'undefined') return;

  const isEggception = window.location.hostname.endsWith('eggception.club');

  document.cookie =
    `theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax; Secure` +
    (isEggception ? '; Domain=.eggception.club' : '');
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Try cookie (cross-subdomain)
    const cookieTheme = readThemeCookie();

    if (cookieTheme) {
      setThemeState(cookieTheme);
      localStorage.setItem('theme', cookieTheme);
      document.documentElement.classList.toggle('dark', cookieTheme === 'dark');
      return;
    }

    // 2. Try localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;

    if (savedTheme === 'light' || savedTheme === 'dark') {
      setThemeState(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      return;
    }

    // 3. System preference fallback
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme: Theme = prefersDark ? 'dark' : 'light';

    setThemeState(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');

    // keep cookie in sync
    writeThemeCookie(initialTheme);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);

    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');

    // ⭐ critical fix
    writeThemeCookie(newTheme);
  };

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme: mounted ? theme : 'dark',
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    return {
      theme: 'dark' as Theme,
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }

  return context;
}
