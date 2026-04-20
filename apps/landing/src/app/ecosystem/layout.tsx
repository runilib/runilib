import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ecosystem & Roadmap - Cross-Platform React Architecture',
  description:
    'Discover the RUNILIB ecosystem vision for React and React Native: shared APIs, consistent DX, accessible defaults and the roadmap for current and future cross-platform packages.',
  keywords: [
    'RUNILIB ecosystem',
    'RUNILIB roadmap',
    'React cross-platform architecture',
    'React Native architecture',
    'shared API design',
    'TypeScript libraries roadmap',
    'cross-platform package architecture',
    'React ecosystem design',
  ],
  openGraph: {
    title: 'RUNILIB Ecosystem - Vision, Architecture & Roadmap',
    description:
      'Shared APIs, composable packages and cross-platform architecture. See the full RUNILIB vision and roadmap.',
    url: 'https://runilib.dev/ecosystem',
  },
  alternates: {
    canonical: 'https://runilib.dev/ecosystem',
  },
};

export default function EcosystemLayout({ children }: { children: React.ReactNode }) {
  return children;
}
