import { siteConfig } from '@/lib/site';

import type { MetadataRoute } from 'next';

const FAVICON_URL = '/logo-icon-black.svg?v=formbridge-20260411b';

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
        src: FAVICON_URL,
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
