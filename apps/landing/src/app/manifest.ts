import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RUNILIB - React Universal Libs',
    short_name: 'RUNILIB',
    description:
      'Open-source ecosystem of React and React Native libraries with shared TypeScript APIs for web and mobile.',
    start_url: '/',
    display: 'standalone',
    background_color: '#080a0e',
    theme_color: '#4adec0',
    categories: ['developer tools', 'productivity', 'utilities'],
    icons: [
      {
        src: '/favicon.svg?v=runilib-2',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
