/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.[jt]sx?$': 'babel-jest' },
  moduleNameMapper: {
    '^react-native$': '<rootDir>/src/__mocks__/react-native.ts',
    '^react-native-svg$': '<rootDir>/src/__mocks__/react-native-svg.ts',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/__mocks__/**'],
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
};
