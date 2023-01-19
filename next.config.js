const calendarTranspile = require('next-transpile-modules')([
  '@fullcalendar/common',
  '@fullcalendar/react',
  '@fullcalendar/daygrid',
  '@fullcalendar/list',
  '@fullcalendar/timegrid'
]);

const withImages = require('next-images');

const redirects = {
  async redirects() {
    return [
      {
        source: '/dashboards/healthcare',
        destination: '/dashboards/healthcare/doctor'
      },
      {
        source: '/dashboards',
        destination: '/'
      },
      {
        source: '/applications',
        destination: '/applications/file-manager'
      },
      {
        source: '/blocks',
        destination: '/blocks/charts-large'
      },
      {
        source: '/management',
        destination: '/management/users'
      }
    ];
  }
};

// module.exports = withImages(
//   calendarTranspile({
//     i18n: {
//       defaultLocale: 'th',
//       locales: ['th']
//     },
//     redirects,
//   })
// );

const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants')

// This uses phases as outlined here: https://nextjs.org/docs/#custom-configuration
module.exports = (phase) => {
  // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environment variable
  const isDev = phase === PHASE_DEVELOPMENT_SERVER
  // when `next build` or `npm run build` is used
  const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1'
  // when `next build` or `npm run build` is used
  const isStaging = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1'

  console.log(`isDev:${isDev}  isProd:${isProd}   isStaging:${isStaging}`)

  const env = {
    REACT_APP_API_URL: (() => {
      if (isDev) return `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}`
      if (isProd) return `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}`
      if (isStaging) return 'http://localhost:11639'
      return 'REACT_APP_API_URL:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
    REACT_APP_API_WATER_URL: (() => {
      if (isDev) return `${process.env.NEXT_PUBLIC_REACT_APP_API_WATER_URL}`
      if (isProd) return `${process.env.NEXT_PUBLIC_REACT_APP_API_WATER_URL}`
      if (isStaging) return 'http://localhost:11639'
      return 'REACT_APP_API_WATER_URL:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
    REACT_APP_API_NONWATER_URL: (() => {
      if (isDev) return `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_URL}`
      if (isProd) return `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_URL}`
      if (isStaging) return 'http://localhost:11639'
      return 'REACT_APP_API_NONWATER_URL:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
    REACT_APP_API_NONWATER_REPORT_URL: (() => {
      if (isDev) return `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}`
      if (isProd) return `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}`
      if (isStaging) return 'http://localhost:11639'
      return 'REACT_APP_API_NONWATER_REPORT_URL:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
    REACT_APP_CRYPTO_IV: (() => {
      if (isDev) return `${process.env.NEXT_PUBLIC_REACT_APP_CRYPTO_IV}`
      if (isProd) return `${process.env.NEXT_PUBLIC_REACT_APP_CRYPTO_IV}`
      if (isStaging) return 'http://localhost:11639'
      return 'REACT_APP_CRYPTO_IV:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
    REACT_APP_CRYPTO_KEY: (() => {
      if (isDev) return `${process.env.NEXT_PUBLIC_REACT_APP_CRYPTO_KEY}`
      if (isProd) return `${process.env.NEXT_PUBLIC_REACT_APP_CRYPTO_KEY}`
      if (isStaging) return 'http://localhost:11639'
      return 'REACT_APP_CRYPTO_KEY:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
    JWT_SECRET_DEVICE: (() => {
      if (isDev) return `${process.env.NEXT_PUBLIC_JWT_SECRET_DEVICE}`
      if (isProd) return `${process.env.NEXT_PUBLIC_JWT_SECRET_DEVICE}`
      if (isStaging) return 'http://localhost:11639'
      return 'JWT_SECRET_DEVICE:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
  }

  // next.config.js object
  return (
    env,
    withImages(
      calendarTranspile({
        i18n: {
          defaultLocale: 'th',
          locales: ['th']
        },
        redirects,
      })
    )
  )
}
