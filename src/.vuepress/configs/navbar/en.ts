import type { NavbarConfig } from '@vuepress/theme-default'
import { version } from '../meta.js'

export const navbarEn: NavbarConfig = [
  {
    text: 'Book',
    link: '/book/',
  },
  {
    text: 'Middlewares',
    children: [
      {
        text: 'Common Features',
        children: [
          '/book/middlewares/affix.md',
          '/book/middlewares/compression.md',
          '/book/middlewares/flash.md',
          '/book/middlewares/force-https.md',
          '/book/middlewares/logging.md',
          '/book/middlewares/proxy.md',
          '/book/middlewares/serve-static.md',
          '/book/middlewares/session.md',
          '/book/middlewares/sse.md',
          '/book/middlewares/timeout.md',
          '/book/middlewares/trailing-slash.md',
          '/book/middlewares/ws.md',
        ],
      },
      {
        text: 'Authentication',
        children: [
          '/book/middlewares/basic-auth.md',
          '/book/middlewares/jwt-auth.md',
        ],
      },
      {
        text: 'Documentation',
        children: [
          '/book/middlewares/openapi.md',
        ],
      },
      {
        text: 'Security',
        children: [
          '/book/middlewares/cors.md',
          '/book/middlewares/csrf.md',
          '/book/middlewares/rate-limiter.md',
        ],
      },
      {
        text: 'Caching',
        children: [
          '/book/middlewares/cache.md',
          '/book/middlewares/caching-headers.md',
        ],
      },
    ],
  },
  {
    text: 'Donate',
    link: '/donate.md',
  },
  {
    text: `v0.44.x`,
    children: [
      {
        text: 'nightly',
        link: 'https://next.salvo.rs',
      },
      {
        text: 'v0.44.x',
        link: 'https://salvo.rs',
      },
    ],
  },
]
