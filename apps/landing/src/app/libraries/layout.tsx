import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Libraries — RUNILIB React & React Native Ecosystem',
  description:
    'Browse RUNILIB libraries and packages for React and React Native. Explore cross-platform modules, shared APIs, documentation and TypeScript-first building blocks for web and mobile.',
  keywords: [
    'RUNILIB libraries',
    'React libraries',
    'React Native libraries',
    'cross-platform npm packages',
    'TypeScript UI libraries',
    'open source React ecosystem',
    'open source React Native ecosystem',
    'shared API packages',
    'composable packages',
  ],
  openGraph: {
    title: 'RUNILIB Libraries — React & React Native Packages',
    description:
      'Explore the RUNILIB collection of cross-platform React and React Native packages for web and mobile.',
    url: 'https://runilib.dev/libraries',
  },
  alternates: {
    canonical: 'https://runilib.dev/libraries',
  },
};

export default function LibrariesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
