'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { useCore } from '@/context/CoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Shirt, Sparkles, Star } from 'lucide-react';

const SLIDES = [
    {
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1600',
        badge: 'New Arrivals',
        BadgeIcon: Flame,
        headline: 'Shop Smart,\nLive Better',
        sub: 'Trending fashion, beauty & lifestyle products — delivered fast across Pakistan.',
        cta: 'Shop Now',
        ctaHref: '/shop',
        secondary: 'View Deals',
        secondaryHref: '/collections/sale',
        accent: 'from-[#e63946] to-[#f4a261]',
    },
    {
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1600',
        badge: 'Fashion & Style',
        BadgeIcon: Shirt,
        headline: 'Discover Your\nStyle Today',
        sub: 'Handbags, jewelry, accessories & more — curated for the modern Pakistani woman.',
        cta: 'Explore Fashion',
        ctaHref: '/shop',
        secondary: 'New Collection',
        secondaryHref: '/collections/new-arrivals',
        accent: 'from-[#2d3561] to-[#e63946]',
    },
    {
        image: 'https://images.unsplash.com/photo-1556228578-8d84f5ae1d91?auto=format&fit=crop&q=80&w=1600',
        badge: 'Beauty Essentials',
        BadgeIcon: Sparkles,
        headline: 'Glow Up With\nPremium Beauty',
        sub: 'Serums, skincare, makeup tools & more. Real products, real results.',
        cta: 'Shop Beauty',
        ctaHref: '/shop',
        secondary: 'Best Sellers',
        secondaryHref: '/collections/bestsellers',
        accent: 'from-[#e63946] to-[#ff6b6b]',
    },
];

const TRUST = [
    { val: '50K+', label: 'Happy Customers' },
    { val: '500+', label: 'Products' },
    { val: '4.8', label: 'Avg Rating', showStar: true },
    { val: 'FREE', label: 'Delivery Available' },
];

export default function Hero() {
    const { banners } = useCore();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setCurrent(p => (p + 1) % SLIDES.length), 6000);
        return () => clearInterval(t);
    }, []);

    const slide = SLIDES[current];

    return (
        <section className="relative overflow-hidden bg-[#1a1a2e]" style={{ minHeight: 'clamp(420px, 80vh, 680px)' }}>
            {/* Background Image Slider */}
            <AnimatePresence mode="sync">
                <motion.div
                    key={current}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: 'easeInOut' }}
                >
                    <img
                        src={slide.image}
                        alt="Hero"
                        className="w-full h-full object-cover object-center"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 hero-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/60 via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <Container className="relative z-10 h-full">
                <div className="flex flex-col justify-center h-full py-16 md:py-20" style={{ minHeight: 'inherit' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            className="max-w-xl space-y-5"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide text-white border border-white/20 bg-white/10 backdrop-blur-sm w-fit">
                                <slide.BadgeIcon className="w-3.5 h-3.5" />
                                {slide.badge}
                            </div>

                            {/* Headline */}
                            <h1
                                className="font-extrabold text-white leading-[1.08]"
                                style={{
                                    fontFamily: 'var(--font-plus-jakarta, Inter, sans-serif)',
                                    fontSize: 'clamp(2rem, 2rem + 3vw, 3.75rem)',
                                    whiteSpace: 'pre-line'
                                }}
                            >
                                {slide.headline}
                            </h1>

                            {/* Sub */}
                            <p className="text-white/75 leading-relaxed max-w-md" style={{ fontSize: 'clamp(14px, 1.6vw, 17px)' }}>
                                {slide.sub}
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row items-start gap-3 pt-2">
                                <Link
                                    href={slide.ctaHref}
                                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[10px] font-bold text-sm text-white shadow-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]"
                                    style={{
                                        background: 'linear-gradient(135deg, #e63946, #c1121f)',
                                        boxShadow: '0 4px 20px rgba(230,57,70,0.4)',
                                    }}
                                >
                                    {slide.cta}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                                <Link
                                    href={slide.secondaryHref}
                                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[10px] font-bold text-sm text-white border border-white/25 bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:border-white/40 active:scale-[0.98]"
                                >
                                    {slide.secondary}
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Slide dots */}
                    <div className="flex items-center gap-2 mt-8 md:mt-10">
                        {SLIDES.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`h-1.5 rounded-full transition-all duration-400 ${i === current ? 'w-8 bg-[#e63946]' : 'w-3 bg-white/30 hover:bg-white/60'}`}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </Container>

            {/* Trust bar at bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md border-t border-white/10 z-10">
                <Container>
                    <div className="grid grid-cols-2 md:grid-cols-4 py-3 gap-2">
                        {TRUST.map((t) => (
                            <div key={t.label} className="flex flex-col items-center justify-center text-center">
                                <span className="text-lg font-black text-white leading-none inline-flex items-center gap-1">
                                    {t.val}
                                    {t.showStar && <Star className="w-3.5 h-3.5 fill-white text-white" />}
                                </span>
                                <span className="text-[10px] text-white/60 font-medium mt-0.5">{t.label}</span>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>
        </section>
    );
}
