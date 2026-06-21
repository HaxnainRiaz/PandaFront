'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { useCore } from '@/context/CoreContext';

const FALLBACK_CATEGORIES = [
    {
        slug: 'jewellery',
        title: 'Jewellery',
        description: 'Elegant sets & accessories',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600',
        href: '/shop',
    },
    {
        slug: 'beauty-products',
        title: 'Beauty Products',
        description: 'Skincare, makeup & wellness',
        image: 'https://images.unsplash.com/photo-1556228578-8d84f5ae1d91?auto=format&fit=crop&q=80&w=600',
        href: '/shop',
    },
    {
        slug: 'ladies-bags',
        title: 'Ladies Bags',
        description: 'Handbags, clutches & totes',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600',
        href: '/shop',
    },
    {
        slug: 'home-gadgets',
        title: 'Home & Gadgets',
        description: 'Smart tools for everyday life',
        image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80&w=600',
        href: '/shop',
    },
];

export default function Categories() {
    const { categories } = useCore();

    const items = categories?.length > 0
        ? categories.slice(0, 4).map((cat) => ({
            slug: cat.slug || cat._id,
            title: cat.title,
            description: cat.description || 'Explore curated products',
            image: cat.image || FALLBACK_CATEGORIES[0].image,
            href: `/shop?category=${cat._id}`,
        }))
        : FALLBACK_CATEGORIES;

    return (
        <section className="py-12 md:py-16 bg-[#f8f9fa]">
            <Container>
                <div className="text-center mb-10">
                    <span className="section-badge mb-3">Shop by Category</span>
                    <h2
                        className="text-2xl md:text-3xl font-extrabold text-[#1a1a2e] mt-2"
                        style={{ fontFamily: 'var(--font-plus-jakarta, Inter, sans-serif)' }}
                    >
                        Find What You Love
                    </h2>
                    <p className="text-[14px] text-gray-500 mt-2 max-w-lg mx-auto">
                        Browse our most popular collections — fashion, beauty, bags, and lifestyle essentials.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {items.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={cat.href}
                            className="group relative overflow-hidden rounded-[14px] bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/80 via-[#1a1a2e]/20 to-transparent" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="text-[15px] md:text-[16px] font-bold text-white mb-0.5">{cat.title}</h3>
                                <p className="text-[11px] text-white/70 line-clamp-1">{cat.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <Link
                        href="/collections"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                        style={{ background: 'linear-gradient(135deg, #e63946, #c1121f)' }}
                    >
                        View All Collections
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </Container>
        </section>
    );
}
