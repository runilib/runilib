import { mergeConfig } from 'vitest/config';
import { sharedVitestConfig } from '../../vitest.shared';

export default mergeConfig(sharedVitestConfig, {
  test: {
    name: 'react-formbridge-web',
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['src/**/*.native.test.{ts,tsx}'],
  },
});
