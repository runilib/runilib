import { defineConfig } from 'vitest/config';

export const sharedVitestConfig = defineConfig({
  test: {
    globals: true,
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html']
    }
  }
});