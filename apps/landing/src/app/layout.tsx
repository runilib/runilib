import type { Metadata } from 'next';
import { AppShell } from '../components/AppShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://runilib.dev'),
  title: {
    default: 'RUNILIB — React Universal Libs | Cross-Platform Libraries',
    template: '%s | RUNILIB',
  },
  description:
    'RUNILIB is a cross-platform collection of libraries for React and React Native. Build forms, onboarding tours, tooltips and more with one shared API across web and mobile.',
  keywords: [
    'React',
    'React Native',
    'cross-platform',
    'TypeScript',
    'form builder',
    'onboarding tour',
    'tooltip',
    'UI library',
    'open source',
    'RUNILIB',
    'react-formbridge',
    'react-walkit',
  ],
  authors: [{ name: 'RUNILIB', url: 'https://github.com/runilib' }],
  creator: 'RUNILIB',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://runilib.dev',
    siteName: 'RUNILIB',
    title: 'RUNILIB — React Universal Libs',
    description:
      'Cross-platform React & React Native libraries. One codebase, web & native. Forms, tours, tooltips and more.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RUNILIB — React Universal Libs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RUNILIB — React Universal Libs',
    description:
      'Cross-platform React & React Native libraries. One codebase, web & native.',
    creator: '@runilib',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://runilib.dev',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
