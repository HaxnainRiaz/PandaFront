import PageHero from '@/components/ui/PageHero';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export const metadata = {
    title: 'Collections - Panda E-Mart',
    description: 'Browse curated collections — bestsellers, new arrivals, sale deals, and more.',
};

export default function CollectionsPage() {
    const collections = [
        { slug: 'bestsellers', title: 'Hot Sellings', description: 'Our most-loved products trusted by thousands', icon: '🔥' },
        { slug: 'new-arrivals', title: 'New Arrivals', description: 'Discover the latest trending products', icon: '✨' },
        { slug: 'sale', title: 'Sale & Deals', description: 'Limited-time offers at unbeatable prices', icon: '🏷️' },
        { slug: 'jewellery', title: 'Jewellery', description: 'Elegant sets, necklaces & accessories', icon: '💎' },
        { slug: 'ladies-bags', title: 'Ladies Bags', description: 'Handbags, clutches & shoulder bags', icon: '👜' },
        { slug: 'beauty-products', title: 'Beauty Products', description: 'Skincare, serums & beauty essentials', icon: '💄' },
    ];

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <PageHero
                badge="Collections"
                title="Shop by Collection"
                subtitle="Curated selections for every style, need, and occasion."
            />

            <Container className="py-12 md:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {collections.map((collection) => (
                        <Link key={collection.slug} href={`/collections/${collection.slug}`}>
                            <Card hover className="text-center p-8 h-full group">
                                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{collection.icon}</div>
                                <h2 className="text-xl font-extrabold text-[#1a1a2e] mb-2 group-hover:text-[#e63946] transition-colors">
                                    {collection.title}
                                </h2>
                                <p className="text-gray-500 text-[14px]">{collection.description}</p>
                            </Card>
                        </Link>
                    ))}
                </div>
            </Container>
        </div>
    );
}
