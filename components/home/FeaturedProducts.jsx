'use client';

import { Container, ProductSkeleton } from '@/components/ui';
import ProductCard from '@/components/commerce/ProductCard';
import { useCore } from '@/context/CoreContext';
import Link from 'next/link';
import { Star } from 'lucide-react';

export default function FeaturedProducts() {
    const { products, loading } = useCore();
    const featured = products.filter(p => p.isFeatured).slice(0, 8);

    if (!loading && featured.length === 0) return null;

    return (
        <section className="py-12 md:py-16 bg-white">
            <Container>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <span className="section-badge mb-3 inline-flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5" />
                            Featured
                        </span>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a1a2e] leading-tight mt-2"
                            style={{ fontFamily: 'var(--font-plus-jakarta, Inter, sans-serif)' }}>
                            Featured Products
                        </h2>
                        <p className="text-[14px] text-gray-500 mt-1.5 max-w-md">
                            Handpicked trending items our customers love the most.
                        </p>
                    </div>
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#e63946] hover:underline flex-shrink-0"
                    >
                        View All
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
                        : featured.map(product => (
                            <ProductCard key={product._id || product.id} product={product} />
                        ))
                    }
                </div>
            </Container>
        </section>
    );
}
