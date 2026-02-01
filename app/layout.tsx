import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import { PostHogProvider } from '@/components/PostHogProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({ subsets: ['latin'] });



export const metadata: Metadata = {
  title: 'Eggception - Wie Memory, nur in deinem Style',
  description: 'Kurze Matches. Deine eigenen Karten. Browser auf – Prompt rein – Ei raus. Dann Deck bauen & battlen.',
  openGraph: {
    title: 'Eggception - Wie Memory, nur in deinem Style',
    description: 'Kurze Matches. Deine eigenen Karten. Browser auf – Prompt rein – Ei raus. Dann Deck bauen & battlen.',
    url: 'https://make-eggception.vercel.app',
    siteName: 'Eggception',
    images: [
      {
        url: 'https://make-eggception.vercel.app/funal_a.png',
        width: 1200,
        height: 630,
        alt: 'Eggception - Wie Memory, nur in deinem Style',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eggception - Wie Memory, nur in deinem Style',
    description: 'Kurze Matches. Deine eigenen Karten. Browser auf – Prompt rein – Ei raus. Dann Deck bauen & battlen.',
    images: [
      {
        url: 'https://make-eggception.vercel.app/funal_a.png',
        alt: 'Eggception - Wie Memory, nur in deinem Style',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={null}>
          <PostHogProvider>
            <LanguageProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </LanguageProvider>
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
