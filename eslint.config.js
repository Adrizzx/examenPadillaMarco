const js = require('@eslint/js');

module.exports = [
  // Carpetas que no se analizan
  { ignores: ['node_modules/**', 'coverage/**'] },

  // Reglas recomendadas de ESLint
  js.configs.recommended,

  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: { require: 'readonly', module: 'writable', process: 'readonly', console: 'readonly' }
    },
    rules: {
      'no-console': 'error', // prohíbe console.log
      eqeqeq: ['error', 'always'], // obliga a usar === y !==
      camelcase: ['error', { properties: 'always' }], // nombres en camelCase
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // variables sin usar
      quotes: ['error', 'single'], // comillas simples
      semi: ['error', 'always'], // punto y coma obligatorio
      'max-lines-per-function': ['error', { max: 20 }] // funciones de máximo 20 líneas
    }
  },

  // Archivos de prueba: variables globales de Jest y bloques describe más largos
  {
    files: ['test/**/*.js'],
    languageOptions: {
      globals: { describe: 'readonly', test: 'readonly', expect: 'readonly', jest: 'readonly' }
    },
    rules: { 'max-lines-per-function': 'off' }
  }
];
