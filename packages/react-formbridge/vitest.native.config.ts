import path from 'node:path';

import { mergeConfig } from 'vitest/config';

import { sharedVitestConfig } from '../../vitest.shared';

export default mergeConfig(sharedVitestConfig, {
  resolve: {
    alias: {
      'react-native': path.resolve(
        __dirname,
        'src/test-utils/react-native-test-shim.tsx',
      ),
    },
  },
  test: {
    name: 'react-formbridge-native',
    environment: 'jsdom',
    include: ['src/**/*.native.test.{ts,tsx}'],
  },
});
