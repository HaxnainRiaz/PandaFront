'use client';

import { useParams } from 'next/navigation';
import PageHero from '@/components/ui/PageHero';
import { Container, ProductSkeleton } from '@/components/ui';
import ProductCard from '@/components/commerce/ProductCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useCore } from '@/context/CoreContext';

export default function CollectionPage() {
    const params = useParams();
    const slug = params.slug;
    const { products: allProducts, loading } = useCore();

    const getCollectionData = (slug, products) => {
        if (!products || products.length === 0) return null;

        switch (slug) {
            case 'bestsellers':
                return {
                    title: 'Hot Sellings',
                    description: 'Our most-loved products trusted by thousands across Pakistan.',
                    products: products.filter(p => p.isBestSeller),
                };
            case 'new-arrivals':
                return {
                    title: 'New Arrivals',
                    description: 'Discover the latest trending products just added to our store.',
                    products: [...products].reverse().slice(0, 12),
                };
            case 'sale':
                return {
                    title: 'Sale & Deals',
                    description: 'Limited-time offers at unbeatable prices — grab them before they are gone.',
                    products: products.filter(p => p.salePrice),
                };
            case 'jewellery':
                return {
                    title: 'Jewellery',
                    description: 'Elegant necklaces, earrings, and jewellery sets.',
                    products: products.filter(p =>
                        p.category?.title?.toLowerCase().includes('jewel') ||
                        slug.includes('jewel')
                    ),
                };
            case 'ladies-bags':
                return {
                    title: 'Ladies Bags',
                    description: 'Handbags, clutches, totes, and shoulder bags.',
                    products: products.filter(p =>
                        p.category?.title?.toLowerCase().includes('bag') ||
                        p.title?.toLowerCase().includes('bag') ||
                        p.title?.toLowerCase().includes('handbag')
                    ),
                };
            case 'beauty-products':
                return {
                    title: 'Beauty Products',
                    description: 'Skincare, serums, makeup, and beauty essentials.',
                    products: products.filter(p =>
                        p.category?.title?.toLowerCase().includes('beauty') ||
                        p.category?.title?.toLowerCase().includes('skin')
                    ),
                };
            default: {
                const categoryProducts = products.filter(p =>
                    p.category?._id === slug ||
                    p.category?.slug === slug ||
                    (p.category?.title && p.category.title.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()) ||
                    (typeof p.category === 'string' && p.category.toLowerCase() === slug.toLowerCase())
                );

                if (categoryProducts.length > 0) {
                    return {
                        title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '),
                        description: `Explore our curated range of ${slug.replace(/-/g, ' ')}.`,
                        products: categoryProducts,
                    };
                }
                return null;
            }
        }
    };

    const collection = getCollectionData(slug, allProducts);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f9fa]">
                <PageHero title="Loading..." subtitle="" />
                <Container className="py-12">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
                    </div>
                </Container>
            </div>
        );
    }

    if (!collection) {
        return (
            <Container className="py-24 text-center">
                <h1 className="text-3xl font-extrabold text-[#1a1a2e] mb-4">Collection Not Found</h1>
                <p className="text-gray-500 mb-8">The collection you are looking for does not exist.</p>
                <Link href="/shop"><Button>Back to Shop</Button></Link>
            </Container>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <PageHero
                badge="Collection"
                title={collection.title}
                subtitle={collection.description}
            />

            <Container className="py-10 md:py-12">
                <p className="text-gray-500 text-sm mb-6">
                    Showing {collection.products.length} {collection.products.length === 1 ? 'product' : 'products'}
                </p>

                {collection.products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {collection.products.map((product) => (
                            <ProductCard key={product._id || product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-[14px] border border-gray-100">
                        <p className="text-xl text-gray-500 mb-4">No products found in this collection</p>
                        <Link href="/shop"><Button variant="outline">Browse All Products</Button></Link>
                    </div>
                )}
            </Container>
        </div>
    );
}
