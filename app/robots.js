import { PRODUCTION_URLS } from '@/lib/apiConfig';

export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_URLS.webstore;
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/account/',
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
