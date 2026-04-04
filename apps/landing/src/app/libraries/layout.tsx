import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Libraries — React & React Native Packages',
  description:
    'Browse all RUNILIB cross-platform libraries: react-formbridge for schema-driven forms, react-walkit for onboarding tours, and tooltip for accessible hints. One API, web & native.',
  keywords: [
    'React libraries',
    'React Native libraries',
    'cross-platform npm packages',
    'react-formbridge',
    'react-walkit',
    'form builder React',
    'onboarding tour React Native',
    'tooltip component',
    'TypeScript UI libraries',
  ],
  openGraph: {
    title: 'RUNILIB Libraries — Cross-Platform React Packages',
    description:
      'Explore the full RUNILIB collection: forms, tours, tooltips. One codebase for web & native.',
    url: 'https://runilib.dev/libraries',
  },
  alternates: {
    canonical: 'https://runilib.dev/libraries',
  },
};

export default function LibrariesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
