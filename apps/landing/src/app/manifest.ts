import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RUNILIB — React Universal Libs',
    short_name: 'RUNILIB',
    description:
      'Cross-platform React & React Native libraries. Forms, onboarding tours, tooltips and more with one shared API.',
    start_url: '/',
    display: 'standalone',
    background_color: '#080a0e',
    theme_color: '#4adec0',
    icons: [
      {
        src: '/favicon.svg?v=runilib-2',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
