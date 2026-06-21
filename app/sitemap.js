export default async function sitemap() {
    const baseUrl = 'https://luminelle.org';

    // In a real app, you would fetch products and categories from your API here
    // to generate dynamic URLs. For now, we'll include the main pages.

    const routes = [
        '',
        '/shop',
        '/about',
        '/contact',
        '/shipping-policy',
        '/refund-policy',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }));

    return [...routes];
}
