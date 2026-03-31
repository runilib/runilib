import path from 'node:path';

import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import { FAKE_CITIES } from './src/mock-api/cities.data';

function fakeCitiesApi(): Plugin {
  return {
    name: 'fake-cities-api',
    configureServer(server) {
      server.middlewares.use('/api/cities', async (req, res) => {
        try {
          const url = new URL(req.url ?? '', 'http://localhost');
          const country = (url.searchParams.get('country') ?? '').toUpperCase();
          const search = (url.searchParams.get('q') ?? '').trim().toLowerCase();

          // Simule une vraie latence réseau
          await new Promise((resolve) => setTimeout(resolve, 450));

          let result = FAKE_CITIES;

          if (country) {
            result = result.filter((city) => city.country === country);
          }

          if (search) {
            result = result.filter((city) => city.label.toLowerCase().includes(search));
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              message: error instanceof Error ? error.message : 'Unknown error',
            }),
          );
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), fakeCitiesApi()],
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      '@runilib/react-walkit': path.resolve(
        __dirname,
        '../../packages/react-walkit/src/index.ts',
      ),
    },
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.web.mjs',
      '.web.mts',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json',
    ],
    dedupe: ['react', 'react-dom', 'react-native-web'],
  },
  optimizeDeps: {
    exclude: ['@runilib/react-walkit'],
  },
});
