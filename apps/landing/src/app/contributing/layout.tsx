import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contributing - Open Source React & React Native Libraries',
  description:
    'Learn how to contribute to RUNILIB open-source React and React Native libraries. Setup guide, coding standards, PR workflow and community guidelines for react-formbridge, react-walkit and the cross-platform ecosystem.',
  keywords: [
    'contribute RUNILIB',
    'open source contribution',
    'React open source',
    'React Native open source',
    'RUNILIB GitHub',
    'pull request guide',
    'developer contribution',
  ],
  openGraph: {
    title: 'Contribute to RUNILIB - Open Source Guide',
    description:
      'Join the RUNILIB community. Learn how to set up the project, submit PRs, and contribute to cross-platform React libraries.',
    url: 'https://runilib.dev/contributing',
  },
  alternates: {
    canonical: 'https://runilib.dev/contributing',
  },
};

export default function ContributingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
