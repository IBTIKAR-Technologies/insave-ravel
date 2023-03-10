module.exports = {
  extends: ['airbnb', 'plugin:react-hooks/recommended'],
  parser: '@babel/eslint-parser',
  plugins: ['jest'],
  parserOptions: {
    ecmaFeatures: {
      classes: true,
    },
  },
  env: {
    'jest/globals': true,
  },
  rules: {
    'max-len': [2, { code: 300, tabWidth: 2, ignoreUrls: true }],
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'no-use-before-define': 'off',
    'global-require': 'off',
    'no-console': 'off',
    'func-names': 'off',
    'import/prefer-default-export': 'off',
    'react/jsx-closing-tag-location': 'off',
    'react/jsx-one-expression-per-line': 'off',
    quotes: 'off',
    camelcase: 'off',
    'arrow-parens': 'off',
    'implicit-arrow-linebreak': 'off',
    'linebreak-style': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'no-underscore-dangle': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-nested-ternary': 'off',
    'react/no-multi-comp': 'off',
    'react/no-unescaped-entities': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-fragments': 'off',
    'react/function-component-definition': 'off',
  },
};
