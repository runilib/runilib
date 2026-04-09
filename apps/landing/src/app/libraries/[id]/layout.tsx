import type { Metadata } from 'next';
import { LIBRARIES } from '../../../data/libraries';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const lib = LIBRARIES.find((l) => l.id === id);

  if (!lib) {
    return {
      title: 'Library Not Found',
    };
  }

  const title = `${lib.name} docs — ${lib.tagline}`;
  const description = `${lib.desc} Installation, API reference, TypeScript examples and cross-platform guidance for React web and React Native.`;

  return {
    title,
    description,
    keywords: [
      lib.name,
      `@runilib/${lib.name}`,
      lib.tagline,
      ...lib.tags,
      'React',
      'React Native',
      'cross-platform',
      'TypeScript',
      'npm package',
      'documentation',
      'API reference',
    ],
    openGraph: {
      title: `${lib.name} docs | RUNILIB`,
      description,
      url: `https://runilib.dev/libraries/${lib.id}`,
    },
    alternates: {
      canonical: `https://runilib.dev/libraries/${lib.id}`,
    },
  };
}

export default function LibraryDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
