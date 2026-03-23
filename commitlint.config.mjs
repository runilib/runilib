export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'refactor', 'test', 'build', 'ci', 'chore', 'perf', 'revert']
    ],
    'scope-case': [2, 'always', ['kebab-case', 'lower-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.']
  }
};