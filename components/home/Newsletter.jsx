'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <section id="newsletter" className="py-12 md:py-16 bg-[#1a1a2e] overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#e63946]/10 rounded-full blur-[120px]" />
            </div>

            <Container className="relative z-10">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider text-[#f4a261] border border-[#f4a261]/25 bg-[#f4a261]/10">
                        Stay Updated
                    </span>
                    <h2
                        className="text-2xl md:text-3xl font-extrabold text-white leading-tight"
                        style={{ fontFamily: 'var(--font-plus-jakarta, Inter, sans-serif)' }}
                    >
                        Get Exclusive Deals & New Arrivals
                    </h2>
                    <p className="text-[14px] text-white/60 max-w-lg mx-auto leading-relaxed">
                        Subscribe to receive special offers, trending product alerts, and early access to sales — straight to your inbox.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            required
                            className="flex-1 px-5 py-3.5 rounded-[10px] bg-white/10 backdrop-blur-sm border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#e63946]/50 transition-colors"
                        />
                        <Button type="submit" size="lg" className="flex-shrink-0">
                            Subscribe
                        </Button>
                    </form>

                    {status === 'success' && (
                        <p className="text-[#10b981] font-semibold text-sm flex items-center justify-center gap-2 animate-fadeIn">
                            <span className="w-5 h-5 rounded-full bg-[#10b981] text-white flex items-center justify-center text-[10px]">✓</span>
                            You&apos;re subscribed! Watch your inbox for deals.
                        </p>
                    )}

                    <p className="text-[11px] text-white/35">
                        No spam. Unsubscribe anytime. We respect your privacy.
                    </p>
                </div>
            </Container>
        </section>
    );
}
