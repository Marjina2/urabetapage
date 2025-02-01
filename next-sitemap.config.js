/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com',
  generateRobotsTxt: true,
  outDir: '.next',
  generateIndexSitemap: false,
  exclude: ['/api/*', '/dashboard/*', '/settings/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api', '/dashboard', '/settings']
      }
    ]
  }
} 