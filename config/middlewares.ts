import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'global::tenant',
  {
    name: 'strapi::body',
    config: {
      multipart: true,
      formidable: { keepExtensions: true },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
