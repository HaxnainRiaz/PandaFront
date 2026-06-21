'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { useCart } from '@/hooks/useCart';
import { useStoreAuth } from '@/context/StoreAuthContext';

const MobileMenu = dynamic(() => import('./MobileMenu'), { ssr: false });
const CartDrawer = dynamic(() => import('@/components/commerce/CartDrawer'), { ssr: false });
const SearchOverlay = dynamic(() => import('@/components/commerce/SearchOverlay'), { ssr: false });

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Collections', href: '/collections' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { itemCount, isClient } = useCart();
    const { user } = useStoreAuth();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header
                className={`sticky top-0 z-40 transition-all duration-300 ${
                    isScrolled
                        ? 'bg-white shadow-[0_2px_16px_rgba(0,0,0,0.10)] border-b border-gray-100'
                        : 'bg-white border-b border-gray-100'
                }`}
            >
                <Container>
                    <div className="flex items-center justify-between h-16 md:h-18 gap-4">

                        {/* ── Hamburger (mobile only) ── */}
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 text-[#1a1a2e] hover:bg-gray-100 rounded-[10px] transition-colors"
                            aria-label="Open menu"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* ── Logo ── */}
                        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
                            <div className="w-8 h-8 rounded-[10px] bg-[#e63946] flex items-center justify-center shadow-sm">
                                <span className="text-white font-black text-sm leading-none">P</span>
                            </div>
                            <div className="leading-none">
                                <span
                                    className="text-lg md:text-xl font-extrabold text-[#1a1a2e] tracking-tight"
                                    style={{ fontFamily: 'var(--font-plus-jakarta, Inter, sans-serif)' }}
                                >
                                    Panda<span className="text-[#e63946]">E-Mart</span>
                                </span>
                            </div>
                        </Link>

                        {/* ── Desktop Navigation ── */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="px-3 py-2 text-[13px] font-semibold text-[#2b2b3b] hover:text-[#e63946] hover:bg-[#e63946]/6 rounded-[8px] transition-all duration-200"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* ── Right Icons ── */}
                        <div className="flex items-center gap-1">
                            {/* Search */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 text-[#2b2b3b] hover:text-[#e63946] hover:bg-gray-100 rounded-[10px] transition-all"
                                aria-label="Search"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* Wishlist */}
                            <Link
                                href="/wishlist"
                                className="hidden sm:flex p-2 text-[#2b2b3b] hover:text-[#e63946] hover:bg-gray-100 rounded-[10px] transition-all"
                                aria-label="Wishlist"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </Link>

                            {/* Account */}
                            <Link
                                href={user ? '/account' : '/account/login'}
                                className="hidden md:flex p-2 text-[#2b2b3b] hover:text-[#e63946] hover:bg-gray-100 rounded-[10px] transition-all relative"
                                aria-label="Account"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {isClient && user && (
                                    <span className="absolute bottom-1.5 right-1.5 w-2 h-2 bg-[#10b981] rounded-full border border-white" />
                                )}
                            </Link>

                            {/* Cart */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 text-[#2b2b3b] hover:text-[#e63946] hover:bg-gray-100 rounded-[10px] transition-all"
                                aria-label="Shopping cart"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {isClient && itemCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-[#e63946] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                        {itemCount > 9 ? '9+' : itemCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </Container>
            </header>

            {isMobileMenuOpen && (
                <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} navigation={navigation} />
            )}
            {isCartOpen && (
                <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            )}
            {isSearchOpen && (
                <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            )}
        </>
    );
}
