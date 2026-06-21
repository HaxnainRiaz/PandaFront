import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export default function PromoBanner() {
    return (
        <section className="py-6 md:py-8">
            <Container>
                <div className="relative overflow-hidden rounded-[16px] bg-gradient-to-r from-[#1a1a2e] via-[#2d3561] to-[#1a1a2e] p-6 md:p-10">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#e63946]/20 rounded-full blur-[80px]" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#e63946] text-white mb-3">
                                Limited Time Offer
                            </span>
                            <h3
                                className="text-xl md:text-2xl font-extrabold text-white leading-tight"
                                style={{ fontFamily: 'var(--font-plus-jakarta, Inter, sans-serif)' }}
                            >
                                Grab Trending Products at Up to 50% Off
                            </h3>
                            <p className="text-[13px] text-white/65 mt-2 max-w-lg">
                                Hot-selling handbags, jewellery, beauty essentials & more — while stocks last.
                            </p>
                        </div>
                        <Link
                            href="/collections/sale"
                            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[10px] text-sm font-bold text-white flex-shrink-0 transition-all hover:scale-[1.03] active:scale-[0.98]"
                            style={{
                                background: 'linear-gradient(135deg, #e63946, #c1121f)',
                                boxShadow: '0 4px 20px rgba(230,57,70,0.4)',
                            }}
                        >
                            Shop Deals Now
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}
