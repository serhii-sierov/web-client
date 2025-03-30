module.exports = {
  root: true,
  ignorePatterns: [
    'webpack.*.mjs',
    '.eslintrc.js',
    'next.config.js',
    'buildContentSecurityPolicy.js',
    'tsconfig.json',
    'externals.mjs',
    'node_modules/',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
    ecmaVersion: 2023,
    ecmaFeatures: {
      jsx: true,
    },
    extraFileExtensions: ['.json'],
  },
  plugins: ['react', 'prefer-arrow', 'import', '@typescript-eslint', 'react-hooks'],
  extends: [
    'eslint:recommended', // base recommended JS config
    'plugin:import/typescript', // import/export syntax
    'plugin:eslint-comments/recommended', // rules for ESLint comments
    'plugin:json/recommended-with-comments', // JSON linting
    'plugin:@typescript-eslint/recommended', // base config for TS
    'plugin:@typescript-eslint/recommended-requiring-type-checking', // enables rules for type checking
    'plugin:prettier/recommended', // code formatting rules
    'plugin:@cspell/recommended', // spelling
    'plugin:@next/next/recommended',
  ],
  rules: {
    // General
    'prefer-arrow-callback': 'error', // we prefer to use arrow functions as callbacks
    'no-void': ['error', { allowAsStatement: true }], // we allow to use "void" to mark promises we don't wait for
    'no-underscore-dangle': ['off'], // we regulate an use of an underscore by other rules
    'quote-props': ['error', 'consistent-as-needed'], // object properties should not use quotes unless necessary
    'quotes': ['error', 'single', { avoidEscape: true }], // use singlequotes for strings
    'curly': ['error', 'all'], // we always use {} in control statements
    'no-console': 'warn', // warning on use of console.log() to call attention to unintentional use

    // React
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ], // we must use arrow functions for React components
    'react/react-in-jsx-scope': 'off', // we don't need import React in all jsx files
    'react/require-default-props': 'off', // we don't use PropTypes
    'react-hooks/exhaustive-deps': 'warn', // we allow passing not all hook dependencies, but want to draw attention
    'react-hooks/rules-of-hooks': 'error', // rules of React hooks must be followed

    // Imports
    'no-duplicate-imports': 'error', // imports from the same source must be in one record
    'import/no-cycle': 'error', // we must avoid cycle imports
    'import/no-extraneous-dependencies': ['error'], // imported external modules must be delcared in package.json,
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],

    // TypeScript
    '@typescript-eslint/no-shadow': 'error', // Vars with the same name in different scopes are not allowed
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Names of unused vars can start only from an underscore
    '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }], // Unused expressions only allowed for short circuit / ternary
    'no-use-before-define': 'off', // We turn this off to prevent incorrect errors with the next rule (TS version of same rule)
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        variables: false, // disabled to allow use of "styles" vars before their definition
      },
    ],
    '@typescript-eslint/no-inferrable-types': ['error', { ignoreParameters: true, ignoreProperties: true }], // do not set types for boolean, number, string, unless in fn params or obj properties
    '@typescript-eslint/no-unsafe-enum-comparison': 'off', // comparing enum values with non-enum values is allowed.
    '@typescript-eslint/restrict-template-expressions': 'off', // allow non-strings in template literals

    // Spell checker
    '@cspell/spellchecker': 'error',

    // Formatting
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: ['return', 'if', 'throw'] },
      { blankLine: 'always', prev: 'if', next: '*' },
      { blankLine: 'always', prev: 'const', next: '*' },
      { blankLine: 'any', prev: 'const', next: ['const', 'let'] },
      {
        blankLine: 'always',
        prev: 'multiline-const',
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'multiline-const',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'export',
      },
      {
        blankLine: 'always',
        prev: 'export',
        next: '*',
      },
    ],

    // Naming convention
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['strictCamelCase', 'StrictPascalCase'],
        leadingUnderscore: 'allow',
        filter: {
          match: false,
          regex:
            '^((Poppins.*)|(\\d(xs|xl)?)|(_stack|_overlay|_presenceTransition|_icon|_text|_focus|_spinner|_dark|_hover|_pressed|_invalid|_entered|_web|_disabled|_checked|_light|testID)|(.*Element)|(No .*)|(Example \\d)|FCWithRef)|(LoticUI*)|(graphQL*)|(user_token)|(& .Mui*)',
        },
      },
      {
        selector: 'variable',
        modifiers: ['global'],
        types: ['number', 'string'],
        format: ['UPPER_CASE'],
      },
      {
        selector: 'variable',
        modifiers: ['destructured'],
        format: ['strictCamelCase', 'StrictPascalCase'],
        filter: {
          match: false,
          regex: '^(secureTextEntry|testID)',
        },
      },
      {
        selector: 'variable',
        modifiers: ['exported'],
        format: ['strictCamelCase', 'StrictPascalCase', 'UPPER_CASE'],
        filter: {
          match: false,
          regex: '^(FCWithRef)|(LoticUI*)',
        },
      },
      {
        selector: 'variable',
        types: ['function'],
        format: ['strictCamelCase', 'StrictPascalCase'],
        filter: {
          match: false,
          regex: '(LoticUI*)',
        },
      },
      {
        selector: 'function',
        format: ['strictCamelCase', 'StrictPascalCase'],
      },
      {
        selector: 'property',
        format: ['strictCamelCase', 'StrictPascalCase'],
        filter: {
          match: false,
          regex:
            '^((Poppins.*)|(\\d(xs|xl)?)|(_stack|_overlay|_presenceTransition|_icon|_text|_focus|_spinner|_dark|_hover|_pressed|_invalid|_entered|_web|_disabled|_checked|_light|testID)|(.*Element)|(No .*)|(Example \\d))|(user_token)|(& .Mui*)',
        },
      },
      {
        selector: 'enum',
        format: ['StrictPascalCase'],
      },
      {
        selector: 'enum',
        format: null,
        filter: {
          match: true,
          regex: '^(TestID)$',
        },
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE'],
        filter: {
          match: false,
          regex: '^\\d+(.\\d)?(XL|XS)',
        },
      },
      {
        selector: 'parameter',
        format: ['strictCamelCase', 'StrictPascalCase'],
        leadingUnderscore: 'allow',
        filter: {
          regex: '^(testID)|(graphQL)',
          match: false,
        },
      },
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['StrictPascalCase'],
        prefix: ['is', 'has', 'show', 'with', 'use', 'no', 'newIs', 'initialIs', 'should'],
        filter: {
          match: false,
          regex: '^visible|(newPlay|play)|buffering|muted|expanded|autoFocus',
        },
      },
      {
        selector: 'interface',
        format: ['StrictPascalCase'],
      },
      {
        selector: 'typeLike',
        format: ['StrictPascalCase'],
        filter: {
          match: false,
          regex: '^(FCWithRef)',
        },
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['./tsconfig.json'],
        // babelOptions: {
        //   plugins: ["react-native-reanimated/plugin"],
        // },
      },
    },
  ],
  settings: {
    'import/ignore': ['node_modules'],
    'react': {
      version: 'detect',
    },
  },
};
