/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['en'],
  sourceLocale: 'en',
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['src/ts'],
    },
  ],
  format: 'po',
};
