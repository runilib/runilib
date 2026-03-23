import { mergeConfig } from 'vitest/config';
import { sharedVitestConfig } from '../../vitest.shared';

export default mergeConfig(sharedVitestConfig, {
  test: {
    name: 'website',
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}']
  }
});