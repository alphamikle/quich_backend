module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint-config-typescript',
    'airbnb-base',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
  ],
  overrides: [
    {
      files: [
        '*.ts',
        '.eslintrc.js',
      ],
    },
  ],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*spec.ts'] },
    ],
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'no-param-reassign': 'off',
    'quotes': [
      'error',
      'single',
    ],
    'import/prefer-default-export': 'off',
    'complexity': 'error',
    'object-curly-spacing': 'error',
    'class-methods-use-this': 'off',
    'array-bracket-spacing': [
      'error',
      'never',
    ],
    'indent': [
      'error',
      2,
    ],
    'import/no-cycle': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'semi': [
      'error',
      'always',
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxEOF: 1,
      },
    ],
    'no-restricted-syntax': 'off',
    'no-await-in-loop': 'off',
  },
};
