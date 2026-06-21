import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Truck, RotateCcw, Lock, Headphones, MapPin, CreditCard, Package } from 'lucide-react';

const trustItems = [
    { Icon: Truck, title: 'Free Delivery', sub: 'Orders over Rs. 4,999' },
    { Icon: RotateCcw, title: 'Easy Returns', sub: '7-day return policy' },
    { Icon: Lock, title: 'Secure Payment', sub: 'Safe & encrypted' },
    { Icon: Headphones, title: '24/7 Support', sub: 'Always here for you' },
];

const bottomItems = [
    { Icon: Lock, label: 'Secure Checkout' },
    { Icon: CreditCard, label: 'Cash on Delivery' },
    { Icon: Package, label: 'All Pakistan Delivery' },
];

export default function Footer() {
    const footerLinks = {
        shop: [
            { name: 'All Products', href: '/shop' },
            { name: 'New Arrivals', href: '/collections/new-arrivals' },
            { name: 'Bestsellers', href: '/collections/bestsellers' },
            { name: 'Sale & Deals', href: '/collections/sale' },
            { name: 'Collections', href: '/collections' },
        ],
        help: [
            { name: 'Contact Us', href: '/contact' },
            { name: 'Shipping Policy', href: '/shipping-policy' },
            { name: 'Refund Policy', href: '/refund-policy' },
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Privacy Policy', href: '/privacy' },
        ],
        company: [
            { name: 'About Us', href: '/about' },
            { name: 'Track Order', href: '/account' },
            { name: 'Wishlist', href: '/wishlist' },
        ],
    };

    return (
        <footer className="bg-[#1a1a2e] text-white mb-[62px] md:mb-0">
            <div className="border-b border-white/8 py-5">
                <Container>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {trustItems.map(({ Icon, title, sub }) => (
                            <div key={title} className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-[10px] bg-white/8 flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-4 h-4 text-[#e63946]" />
                                </div>
                                <div>
                                    <p className="text-[12px] font-bold text-white">{title}</p>
                                    <p className="text-[11px] text-white/50">{sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </div>

            <Container>
                <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    <div className="space-y-5">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-[10px] bg-[#e63946] flex items-center justify-center">
                                <span className="text-white font-black text-sm">P</span>
                            </div>
                            <span className="text-xl font-extrabold">
                                Panda<span className="text-[#e63946]">E-Mart</span>
                            </span>
                        </div>
                        <p className="text-[13px] text-white/55 leading-relaxed">
                            Your one-stop online store for fashion, beauty, gadgets, and lifestyle products across Pakistan. Shop smart, live better.
                        </p>
                        <div className="flex items-center gap-3">
                            {[
                                { label: 'Facebook', href: 'https://facebook.com', icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /> },
                                { label: 'Instagram', href: 'https://instagram.com', icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /> },
                                { label: 'TikTok', href: 'https://tiktok.com', icon: <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.92-.23-2.74.35-.8.5-1.32 1.4-1.4 2.34-.14 1.03.24 2.11 1.05 2.81.76.66 1.83.92 2.83.65.86-.21 1.64-.78 1.98-1.6.14-.34.22-.72.24-1.1 0-5.84.05-11.69.01-17.53z" /> },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-[10px] bg-white/8 flex items-center justify-center hover:bg-[#e63946] transition-all duration-300"
                                    aria-label={social.label}
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        {social.icon}
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e63946] mb-5">Shop</h4>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-[13px] text-white/55 hover:text-white transition-colors duration-200">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e63946] mb-5">Help</h4>
                        <ul className="space-y-3">
                            {footerLinks.help.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-[13px] text-white/55 hover:text-white transition-colors duration-200">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#e63946] mb-5">Company</h4>
                        <ul className="space-y-3 mb-6">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-[13px] text-white/55 hover:text-white transition-colors duration-200">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="space-y-2">
                            <p className="text-[11px] text-white/40 uppercase tracking-wide font-bold">Contact</p>
                            <a href="mailto:pandaemart03@gmail.com" className="text-[13px] text-white/55 hover:text-white transition-colors block">
                                pandaemart03@gmail.com
                            </a>
                            <a href="tel:03435718296" className="text-[13px] text-white/55 hover:text-white transition-colors block">
                                0343-5718296
                            </a>
                            <p className="text-[13px] text-white/55 inline-flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                Pakistan
                            </p>
                        </div>
                    </div>
                </div>
            </Container>

            <div className="border-t border-white/8">
                <Container>
                    <div className="py-5 flex flex-col md:flex-row items-center justify-between gap-3">
                        <p className="text-[12px] text-white/30">
                            © {new Date().getFullYear()} Panda E-Mart. All rights reserved.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-white/30">
                            {bottomItems.map(({ Icon, label }, i) => (
                                <span key={label} className="inline-flex items-center gap-1.5">
                                    {i > 0 && <span className="hidden md:inline">•</span>}
                                    <Icon className="w-3.5 h-3.5" />
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                </Container>
            </div>
        </footer>
    );
}
