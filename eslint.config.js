import antfu from '@antfu/eslint-config';

export default antfu(
  {
    typescript: {
      tsconfigPath: 'tsconfig.json',
    },
    stylistic: {
      semi: true,
    },
    formatters: true,
    test: {
      overrides: {
        'test/prefer-lowercase-title': [
          'error',
          {
            ignore: ['describe'],
          },
        ],
      },
    },
  },
  {
    rules: {
      'ts/strict-boolean-expressions': 'off',
    },
  },
  {
    ignores: ['components/ui/chart.tsx'],
  },
  {
    ignores: ['**/*.json', '**/*.md', 'components/ui/**'],
    rules: {
      'max-len': [
        'error',
        {
          code: 100,
        },
      ],
    },
  },
);
