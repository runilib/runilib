import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation — RUNILIB API Reference & Guides',
  description:
    'Documentation for RUNILIB libraries and ecosystem packages. Explore installation guides, API reference, examples and tutorials for cross-platform React and React Native development.',
  keywords: [
    'RUNILIB documentation',
    'API reference',
    'TypeScript examples',
    'React package docs',
    'React Native package docs',
    'cross-platform library docs',
    'developer guides',
  ],
  openGraph: {
    title: 'RUNILIB Docs — API Reference & Guides',
    description:
      'Installation guides, API reference and examples for the RUNILIB React and React Native ecosystem.',
    url: 'https://runilib.dev/docs',
  },
  alternates: {
    canonical: 'https://runilib.dev/docs',
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
