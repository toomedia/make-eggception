import './globals.css';
import type { Metadata } from 'next';
import ClientLayout from '@/components/ClientLayout';
import { funnelConfig } from '@/lib/funnelConfig';

export const metadata: Metadata = {
  title: funnelConfig.metadata.title,
  description: funnelConfig.metadata.description,
  openGraph: {
    title: funnelConfig.metadata.title,
    description: funnelConfig.metadata.description,
    url: funnelConfig.metadata.url,
    siteName: 'Eggception',
    images: [
      {
        url: funnelConfig.metadata.imageUrl,
        width: 1200,
        height: 630,
        alt: funnelConfig.metadata.imageAlt,
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: funnelConfig.metadata.title,
    description: funnelConfig.metadata.description,
    images: [
      {
        url: funnelConfig.metadata.imageUrl,
        alt: funnelConfig.metadata.imageAlt,
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
