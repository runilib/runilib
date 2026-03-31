import { mergeConfig } from 'vitest/config';
import { sharedVitestConfig } from '../../vitest.shared';

export default mergeConfig(sharedVitestConfig, {
  test: {
    name: 'landing',
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
  }
});
