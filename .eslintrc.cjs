/* eslint-env node */
module.exports = {
  extends: [
    'eslint:recommended',
    "plugin:react/recommended",
    'plugin:react-hooks/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ],
  rules: {
    'semi': ['error', 'always'],
    'quotes': ['warn', 'single'],
    'indent': ['warn', 2, {
      'FunctionDeclaration': {
        'body': 1,
        'parameters': 2,
      },
      'MemberExpression': 2,
      'SwitchCase': 1,
    }],
    'eqeqeq': ['warn', 'always', {
      'null': 'never',
    }],
    'comma-dangle': ['warn', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'always-multiline',
    }],
    'func-style': ['warn', 'declaration', {
      'allowArrowFunctions': false,
    }],
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'prefer-destructuring': 'warn',
    'object-curly-spacing': ['warn', 'always'],
    'object-curly-newline': ['warn', {
      'multiline': true,
      'minProperties': 2,
      'consistent': true,
    }],
    "import-newlines/enforce": [
      'warn',
      {
        "items": 1,
        "semi": true
      }
    ],
    'no-multi-spaces': ['warn'],
    'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
    '@typescript-eslint/no-unused-vars': 'off',
		'unused-imports/no-unused-imports': "error",
		'unused-imports/no-unused-vars': [
			'warn',
			{ 'vars': 'all', 'varsIgnorePattern': '^_', 'args': 'after-used', 'argsIgnorePattern': '^_' },
		],
    'default-case': ['error'],
    'no-multiple-empty-lines': ['warn', {
      'max': 1,
      'maxBOF': 0,
      'maxEOF': 1,
    }],
    "destructuring-newline/object-property-newline": ['warn'],
    'import/no-relative-parent-imports': ['warn'],
    'import/no-cycle': ['error'],
    'import/no-self-import': ['error'],
    'react/display-name': ['off'],
    'react/react-in-jsx-scope': ['off'],
    'react/jsx-max-props-per-line': ['warn', { maximum: 1 }],
    'react/jsx-indent-props': ['warn', 2],
    'react/jsx-first-prop-new-line': ['warn', 'multiline-multiprop'],
    'react/jsx-closing-bracket-location': ['warn', 'tag-aligned'],
    '@typescript-eslint/consistent-type-imports': ['warn', {}],
    '@typescript-eslint/switch-exhaustiveness-check': ['error'],
    '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
    '@typescript-eslint/prefer-readonly': ['warn'],
    '@typescript-eslint/consistent-type-assertions': ['warn', {
      'assertionStyle': 'never',
    }],
    '@typescript-eslint/ban-types': ['warn', {
      'types': {
        '{}': false,
      },
      'extendDefaults': true,
    }],
    '@typescript-eslint/prefer-readonly-parameter-types': ['warn', {
      'allow': [
        // DOM lib
        { 'from': 'lib', 'name': ['Event'] },
        // React
        {
          'from': 'package',
          'package': 'react',
          'name': [
            'ComponentType',
            'ComponentClass',
            'FunctionComponent',
            'Element',
            'SyntheticEvent',
            'Attributes',
            'IntrinsicAttributes',
            'ChangeEvent',
          ],
        },
        // RxJS
        {
          'from': 'package',
          'package': 'rxjs',
          'name': [
            'Observer',
            'Observable',
            'Subject',
          ],
        },
        // Material UI
        {
          'from': 'package',
          'package': '@mui/material',
          'name': [
            'SelectChangeEvent',
          ],
        },
      ],
    }],
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'simple-import-sort',
    'destructuring-newline',
    'import-newlines',
    'import',
    'unused-imports',
  ],
  root: true,
  settings: {
    'import/resolver': {
      //'typescript': true,
      'node': true,
    },
    react: {
      version: 'detect',
    },
  },
};
