module.exports = {
  extends: ['@unikit/eslint-config'],
  parserOptions: { project: './tsconfig.json' },
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
};
