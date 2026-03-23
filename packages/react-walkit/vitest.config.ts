import { mergeConfig } from 'vitest/config';
import { sharedVitestConfig } from '../../vitest.shared';

export default mergeConfig(sharedVitestConfig, {
  test: {
    name: 'react-walkit',
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}']
  }
});