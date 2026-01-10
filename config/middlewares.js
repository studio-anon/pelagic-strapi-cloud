module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'http://localhost:1337',
            'https:',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'http://localhost:1337',
            'https:',
          ],
          'script-src': [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
          ],
          'style-src': [
            "'self'",
            "'unsafe-inline'",
          ],
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
