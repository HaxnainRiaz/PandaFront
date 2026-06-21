'use client';

import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export default function BrandStory() {
    return (
        <section className="py-12 md:py-16 bg-white overflow-hidden">
            <Container>
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div className="relative aspect-[4/3] rounded-[16px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.1)]">
                            <img
                                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800"
                                alt="Panda E-Mart shopping experience"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/60 to-transparent" />
                            <div className="absolute bottom-5 left-5 right-5">
                                <p className="text-white font-bold text-lg">Buy Quality Products</p>
                                <p className="text-white/70 text-[13px]">Trusted by 50,000+ customers across Pakistan</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <span className="section-badge">About Panda E-Mart</span>
                            <h2
                                className="text-2xl md:text-3xl font-extrabold text-[#1a1a2e] leading-tight"
                                style={{ fontFamily: 'var(--font-plus-jakarta, Inter, sans-serif)' }}
                            >
                                Pakistan&apos;s Trusted Online Marketplace
                            </h2>
                            <p className="text-[14px] text-gray-500 leading-relaxed">
                                Panda E-Mart brings you trending fashion, beauty, jewellery, handbags, and lifestyle essentials — all in one place. We believe online shopping should be simple, affordable, and trustworthy.
                            </p>
                            <p className="text-[14px] text-gray-500 leading-relaxed">
                                From hot-selling handbags to premium beauty products, every item is carefully selected to deliver real value. Fast delivery, cash on delivery, and hassle-free returns — because your satisfaction comes first.
                            </p>
                            <Link
                                href="/about"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                                style={{ background: 'linear-gradient(135deg, #e63946, #c1121f)' }}
                            >
                                Learn More About Us
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
