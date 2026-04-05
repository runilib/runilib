/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: JSON-LD requires dangerouslySetInnerHTML — standard Next.js pattern */
import type { Metadata } from 'next';
import { AppShell } from '../components/AppShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://runilib.dev'),
  title: {
    default:
      'RUNILIB — React Universal Libs | Cross-Platform Libraries for React & React Native',
    template: '%s | RUNILIB',
  },
  description:
    'RUNILIB is a cross-platform collection of open-source libraries for React and React Native. Build forms, onboarding tours, tooltips and more with one shared TypeScript API across web and mobile. Zero config, fully typed, tree-shakeable.',
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
    'schema-driven forms',
    'spotlight tour',
    'React form validation',
    'React Native form builder',
    'cross-platform onboarding',
    'accessible tooltip',
    'WCAG',
    'tree-shakeable',
    'npm packages',
    'React hooks',
    'useFormBridge',
    'WalkitProvider',
    'mobile web shared code',
  ],
  authors: [{ name: 'RUNILIB', url: 'https://github.com/runilib' }],
  creator: 'RUNILIB',
  publisher: 'RUNILIB',
  category: 'technology',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://runilib.dev',
    siteName: 'RUNILIB',
    title: 'RUNILIB — Cross-Platform React & React Native Libraries',
    description:
      'Open-source cross-platform libraries. One TypeScript API for web & native. Forms, onboarding tours, tooltips and more.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'RUNILIB — React Universal Libs',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RUNILIB — React Universal Libs',
    description:
      'Cross-platform React & React Native libraries. One codebase, web & native. Forms, tours, tooltips.',
    creator: '@runilib',
    images: ['/opengraph-image'],
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
  icons: {
    icon: '/favicon.svg?v=runilib-2',
    shortcut: '/favicon.svg?v=runilib-2',
    apple: '/favicon.svg?v=runilib-2',
  },
  other: {
    'google-site-verification': '',
  },
};

function JsonLd() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RUNILIB',
    url: 'https://runilib.dev',
    logo: 'https://runilib.dev/brand/runilib-icon.svg',
    sameAs: ['https://github.com/runilib', 'https://www.npmjs.com/org/runilib'],
    description:
      'Open-source cross-platform React & React Native libraries. Forms, onboarding tours, tooltips and more.',
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RUNILIB',
    url: 'https://runilib.dev',
    description: 'Cross-platform collection of libraries for React and React Native.',
    publisher: {
      '@type': 'Organization',
      name: 'RUNILIB',
    },
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: 'RUNILIB',
    url: 'https://github.com/runilib',
    codeRepository: 'https://github.com/runilib',
    programmingLanguage: ['TypeScript', 'React', 'React Native'],
    license: 'https://opensource.org/licenses/MIT',
    runtimePlatform: ['Node.js', 'Browser', 'React Native'],
    description:
      'Cross-platform React & React Native libraries: react-formbridge (forms), react-walkit (onboarding tours & tooltips).',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema),
        }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
        <JsonLd />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
