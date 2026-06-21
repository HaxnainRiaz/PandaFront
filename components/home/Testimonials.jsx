'use client';

import { Container } from '@/components/ui/Container';
import { useState } from 'react';
import { MessageSquare } from 'lucide-react';

const REVIEWS = [
    {
        name: 'Ayesha Khan',
        location: 'Lahore, Pakistan',
        rating: 5,
        text: 'Absolutely love the quality! Ordered a handbag and it arrived within 2 days. Exactly as shown in the picture. Will definitely order again from Panda E-Mart!',
        product: 'Ladies Handbag',
        avatar: 'AK',
    },
    {
        name: 'Fatima Malik',
        location: 'Karachi, Pakistan',
        rating: 5,
        text: 'The serum I ordered worked wonders on my skin! Great price too. Cash on delivery made it so easy. Highly recommend this store to everyone!',
        product: 'Anti-Aging Serum',
        avatar: 'FM',
    },
    {
        name: 'Sana Riaz',
        location: 'Islamabad, Pakistan',
        rating: 5,
        text: 'Super fast delivery and the product was well-packaged. The kitchen gadget I bought is exactly what I needed. Panda E-Mart is now my go-to for online shopping!',
        product: 'Kitchen Gadget Set',
        avatar: 'SR',
    },
    {
        name: 'Hira Baig',
        location: 'Faisalabad, Pakistan',
        rating: 5,
        text: 'I was skeptical at first, but the quality exceeded my expectations. Beautiful jewelry set at such an affordable price. 10/10 would shop again!',
        product: 'Gold Jewelry Set',
        avatar: 'HB',
    },
];

export default function Testimonials() {
    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent(p => (p - 1 + REVIEWS.length) % REVIEWS.length);
    const next = () => setCurrent(p => (p + 1) % REVIEWS.length);
    const r = REVIEWS[current];

    return (
        <section className="py-12 md:py-16 bg-white overflow-hidden">
            <Container>
                {/* Header */}
                <div className="text-center mb-10">
                    <span className="section-badge mb-3 inline-flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Reviews
                    </span>
                    <h2
                        className="text-2xl md:text-3xl font-extrabold text-[#1a1a2e] mt-2"
                        style={{ fontFamily: 'var(--font-plus-jakarta, Inter, sans-serif)' }}
                    >
                        What Our Customers Say
                    </h2>
                    <p className="text-[14px] text-gray-500 mt-2 max-w-md mx-auto">
                        Real reviews from real people across Pakistan.
                    </p>
                </div>

                {/* Testimonial Card */}
                <div className="max-w-2xl mx-auto">
                    <div className="relative bg-[#f8f9fa] rounded-[16px] border border-gray-100 p-7 md:p-10 text-center">
                        {/* Quote icon */}
                        <div className="text-5xl text-[#e63946]/15 font-black leading-none select-none absolute top-5 left-7">"</div>

                        {/* Stars */}
                        <div className="flex items-center justify-center gap-1 mb-5">
                            {[...Array(r.rating)].map((_, i) => (
                                <svg key={i} className="w-5 h-5 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>

                        {/* Review text */}
                        <p className="text-[15px] md:text-[17px] text-[#2b2b3b] leading-relaxed font-medium mb-7 italic">
                            "{r.text}"
                        </p>

                        {/* Reviewer */}
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#e63946] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {r.avatar}
                            </div>
                            <div className="text-left">
                                <p className="text-[13px] font-bold text-[#1a1a2e]">{r.name}</p>
                                <p className="text-[11px] text-gray-400">{r.location} · Bought: {r.product}</p>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-5 mt-7">
                        <button onClick={prev} className="w-10 h-10 rounded-full border border-gray-200 text-[#1a1a2e] hover:border-[#e63946] hover:text-[#e63946] transition-all flex items-center justify-center" aria-label="Previous">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div className="flex gap-2">
                            {REVIEWS.map((_, i) => (
                                <button key={i} onClick={() => setCurrent(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-7 bg-[#e63946]' : 'w-3 bg-gray-200 hover:bg-gray-300'}`}
                                    aria-label={`Review ${i + 1}`}
                                />
                            ))}
                        </div>
                        <button onClick={next} className="w-10 h-10 rounded-full border border-gray-200 text-[#1a1a2e] hover:border-[#e63946] hover:text-[#e63946] transition-all flex items-center justify-center" aria-label="Next">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </Container>
        </section>
    );
}
