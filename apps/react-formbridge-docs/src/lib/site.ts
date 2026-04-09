import { libraryInfo } from '@/data/site';

export const siteConfig = {
  name: 'react-formbridge docs',
  title: 'react-formbridge docs',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://react-formbridge.runilib.dev',
  description: libraryInfo.description,
  ogImage: '/opengraph-image',
  links: {
    home: '/',
    docs: '/docs',
    npm: libraryInfo.npmUrl,
    github: libraryInfo.githubUrl,
    repo: libraryInfo.monorepoUrl,
    issues: libraryInfo.repoIssuesUrl,
  },
};

export function absoluteUrl(pathname = '/') {
  return new URL(pathname, siteConfig.url).toString();
}
