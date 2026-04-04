import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation — API Reference & Guides',
  description:
    'Complete documentation for RUNILIB libraries. Installation guides, API reference, code examples, and tutorials for react-formbridge, react-walkit, and tooltip.',
  keywords: [
    'RUNILIB documentation',
    'react-formbridge docs',
    'react-walkit docs',
    'React form builder tutorial',
    'onboarding tour guide',
    'API reference',
    'TypeScript examples',
  ],
  openGraph: {
    title: 'RUNILIB Docs — Complete API Reference & Guides',
    description:
      'Installation, API reference, and real-world examples for every RUNILIB library.',
    url: 'https://runilib.dev/docs',
  },
  alternates: {
    canonical: 'https://runilib.dev/docs',
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
