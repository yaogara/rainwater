import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ? site.toString() : "https://rainwater.directory/";
  const baseUrl = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;
  const sitemapURL = new URL('sitemap-index.xml', baseUrl);
  return new Response(
    `
User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`.trim(),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    }
  );
};
