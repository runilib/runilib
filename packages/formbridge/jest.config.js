module.exports = {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.[jt]sx?$': 'babel-jest' },
  moduleNameMapper: { '^react-native$': '<rootDir>/src/__mocks__/react-native.ts' },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/__mocks__/**'],
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
};
