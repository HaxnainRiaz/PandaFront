import { Container } from '@/components/ui/Container';
import {
    Truck, BadgeCheck, CircleDollarSign, Undo2, Package, Users, Lightbulb, Star,
} from 'lucide-react';

const WHY = [
    {
        Icon: Truck,
        title: 'Fast Nationwide Delivery',
        desc: 'We deliver across all cities of Pakistan — quickly, safely, and reliably.',
    },
    {
        Icon: BadgeCheck,
        title: '100% Authentic Products',
        desc: 'Every product is verified for quality. What you see is exactly what you get.',
    },
    {
        Icon: CircleDollarSign,
        title: 'Best Price Guarantee',
        desc: 'We offer the most competitive prices on trending lifestyle products in Pakistan.',
    },
    {
        Icon: Undo2,
        title: 'Hassle-Free Returns',
        desc: '7-day easy return policy. Not satisfied? We will make it right, no questions asked.',
    },
    {
        Icon: Package,
        title: 'Cash on Delivery',
        desc: 'Pay when your order arrives. Safe, trusted, and convenient for everyone.',
    },
    {
        Icon: Users,
        title: '50,000+ Happy Customers',
        desc: 'Thousands of Pakistanis shop with us every month. Join our growing community.',
    },
];

export default function Benefits() {
    return (
        <section id="benefits" className="py-14 md:py-18 bg-[#1a1a2e] text-white overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-[#e63946]/15 rounded-full blur-[100px]" />
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#2d3561]/40 rounded-full blur-[100px]" />
            </div>

            <Container className="relative z-10">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider text-[#f4a261] border border-[#f4a261]/25 bg-[#f4a261]/10 mb-4">
                        <Lightbulb className="w-3.5 h-3.5" />
                        Why Panda E-Mart
                    </span>
                    <h2
                        className="text-2xl md:text-3xl font-extrabold text-white leading-tight"
                        style={{ fontFamily: 'var(--font-plus-jakarta, Inter, sans-serif)' }}
                    >
                        Shopping Made Better
                    </h2>
                    <p className="text-[14px] text-white/55 max-w-xl mx-auto mt-3 leading-relaxed">
                        We&apos;re Pakistan&apos;s trusted online store — delivering quality, value, and an experience you can rely on.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {WHY.map((item) => (
                        <div
                            key={item.title}
                            className="group flex gap-4 p-5 rounded-[14px] bg-white/5 border border-white/8 hover:bg-white/10 hover:border-white/16 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-[12px] bg-[#e63946]/15 border border-[#e63946]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#e63946]/25 transition-colors">
                                <item.Icon className="w-5 h-5 text-[#e63946]" />
                            </div>
                            <div>
                                <h3 className="text-[15px] font-bold text-white mb-1.5">{item.title}</h3>
                                <p className="text-[13px] text-white/50 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/8">
                    {[
                        { val: '50K+', label: 'Happy Customers' },
                        { val: '500+', label: 'Products Listed' },
                        { val: '4.8', label: 'Average Rating', showStar: true },
                        { val: '100+', label: 'Cities Covered' },
                    ].map(s => (
                        <div key={s.label} className="text-center">
                            <p className="text-3xl md:text-4xl font-black text-[#e63946] inline-flex items-center justify-center gap-1">
                                {s.val}
                                {s.showStar && <Star className="w-5 h-5 fill-[#e63946] text-[#e63946]" />}
                            </p>
                            <p className="text-[12px] text-white/40 font-semibold uppercase tracking-wider mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
