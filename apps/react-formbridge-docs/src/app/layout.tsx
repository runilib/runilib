/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: JSON-LD is required for rich SEO metadata */

import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { StyledRegistry } from '@/components/StyledRegistry';
import { ThemeProviders } from '@/components/ThemeProviders';
import { libraryInfo, primaryKeywords } from '@/data/site';
import { siteConfig } from '@/lib/site';

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: `${libraryInfo.name} docs | React and React Native forms`,
    template: '%s | react-formbridge docs',
  },
  description: siteConfig.description,
  keywords: primaryKeywords,
  alternates: {
    canonical: siteConfig.url,
  },
  category: 'technology',
  openGraph: {
    type: 'website',
    title: `${libraryInfo.name} docs | React and React Native forms`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    url: siteConfig.url,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'react-formbridge documentation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${libraryInfo.name} docs | React and React Native forms`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

function RootJsonLd() {
  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: 'en',
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: libraryInfo.name,
    url: siteConfig.url,
    codeRepository: libraryInfo.monorepoUrl,
    downloadUrl: libraryInfo.npmUrl,
    programmingLanguage: ['TypeScript', 'React', 'React Native'],
    runtimePlatform: ['Browser', 'React Native'],
    license: 'https://opensource.org/licenses/MIT',
    description: libraryInfo.shortDescription,
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        type="application/ld+json"
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <RootJsonLd />
        <StyledRegistry>
          <ThemeProviders>
            <SiteHeader />
            <div className="site-frame">{children}</div>
            <SiteFooter />
          </ThemeProviders>
        </StyledRegistry>
      </body>
    </html>
  );
}
