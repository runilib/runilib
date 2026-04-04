import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ecosystem & Roadmap — Vision & Architecture',
  description:
    'Discover the RUNILIB ecosystem vision: schema-first architecture, consistent APIs across libraries, roadmap for 2026 including storex, toastly, modalkit, and motionkit.',
  keywords: [
    'RUNILIB ecosystem',
    'RUNILIB roadmap',
    'React cross-platform architecture',
    'schema-first',
    'TypeScript libraries roadmap',
    'storex',
    'toastly',
    'modalkit',
    'motionkit',
  ],
  openGraph: {
    title: 'RUNILIB Ecosystem — Vision, Architecture & Roadmap',
    description:
      'Schema-first, accessible, tree-shakeable. See the full RUNILIB vision and upcoming libraries.',
    url: 'https://runilib.dev/ecosystem',
  },
  alternates: {
    canonical: 'https://runilib.dev/ecosystem',
  },
};

export default function EcosystemLayout({ children }: { children: React.ReactNode }) {
  return children;
}
