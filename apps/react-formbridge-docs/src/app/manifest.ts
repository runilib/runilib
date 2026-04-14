import { siteConfig } from '@/lib/site';

import type { MetadataRoute } from 'next';

const FAVICON_ICO_URL = '/favicon.ico?v=formbridge-20260412c';
const FAVICON_SVG_URL = '/brand/logo-icon-blue.svg?v=formbridge-20260412c';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: 'formbridge docs',
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#08111a',
    theme_color: '#08111a',
    icons: [
      {
        src: FAVICON_ICO_URL,
        sizes: '16x16 32x32 48x48 64x64 128x128',
        type: 'image/x-icon',
      },
      {
        src: FAVICON_SVG_URL,
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
