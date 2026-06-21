export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/account/',
        },
        sitemap: 'https://luminelle.org/sitemap.xml',
    }
}
