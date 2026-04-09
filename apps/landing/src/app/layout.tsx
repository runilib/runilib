/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: JSON-LD requires dangerouslySetInnerHTML — standard Next.js pattern */
import type { Metadata } from 'next';
import { AppShell } from '../components/AppShell';
import { LIBRARIES } from '../data/libraries';

const BASE_URL = 'https://runilib.dev';
const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: 'RUNILIB',
  referrer: 'origin-when-cross-origin',
  title: {
    default: 'RUNILIB | Cross-Platform React & React Native Ecosystem',
    template: '%s | RUNILIB',
  },
  description:
    'RUNILIB is an open-source ecosystem of React and React Native libraries built around shared APIs, strong TypeScript DX, accessible defaults and reusable building blocks for web and mobile.',
  keywords: [
    'RUNILIB',
    'React libraries',
    'React Native libraries',
    'cross-platform React ecosystem',
    'cross-platform React Native ecosystem',
    'TypeScript UI libraries',
    'open source React packages',
    'open source React Native packages',
    'React developer tools',
    'React Native developer tools',
    'composable packages',
    'web and mobile shared API',
    'tree-shakeable npm packages',
    'accessible React components',
    'shared TypeScript API',
    'cross-platform npm packages',
  ],
  authors: [{ name: 'RUNILIB', url: 'https://github.com/runilib' }],
  creator: 'RUNILIB',
  publisher: 'RUNILIB',
  category: 'technology',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'RUNILIB',
    title: 'RUNILIB | Cross-Platform React & React Native Ecosystem',
    description:
      'Open-source ecosystem of React and React Native libraries with shared TypeScript APIs for web and mobile.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'RUNILIB — Cross-platform React and React Native ecosystem',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RUNILIB | React & React Native Libraries',
    description:
      'Open-source ecosystem of React and React Native libraries with shared APIs for web and mobile.',
    creator: '@runilib',
    site: '@runilib',
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
    canonical: BASE_URL,
  },
  icons: {
    icon: '/favicon.svg?v=runilib-2',
    shortcut: '/favicon.svg?v=runilib-2',
    apple: '/favicon.svg?v=runilib-2',
  },
  ...(GOOGLE_SITE_VERIFICATION
    ? {
        other: {
          'google-site-verification': GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

function JsonLd() {
  const libraryCollectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'RUNILIB libraries',
    url: `${BASE_URL}/libraries`,
    description:
      'Collection of cross-platform React and React Native libraries with shared APIs and consistent TypeScript DX.',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: LIBRARIES.map((lib, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${BASE_URL}/libraries/${lib.id}`,
        name: lib.name,
        description: lib.desc,
      })),
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RUNILIB',
    url: BASE_URL,
    logo: `${BASE_URL}/brand/runilib-icon.svg`,
    sameAs: ['https://github.com/runilib', 'https://www.npmjs.com/org/runilib'],
    description:
      'Open-source ecosystem of React and React Native libraries with shared APIs and packages built for web and mobile.',
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RUNILIB',
    url: BASE_URL,
    inLanguage: ['en', 'fr'],
    description:
      'Cross-platform collection of React and React Native libraries with one shared TypeScript API.',
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
      'Cross-platform ecosystem of React and React Native libraries with shared TypeScript APIs and reusable building blocks.',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(libraryCollectionSchema),
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
