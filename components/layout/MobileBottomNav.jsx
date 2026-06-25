'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import MobileMoreMenu from './MobileMoreMenu';

const navItems = [
    {
        name: 'Shop',
        href: '/shop',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        ),
    },
    {
        name: 'Categories',
        href: '/collections',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
        ),
    },
    {
        name: 'Home',
        href: '/',
        isCenter: true,
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        name: 'Cart',
        href: '/cart',
        isCart: true,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
    },
    {
        name: 'More',
        isMore: true,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
        ),
    },
];

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { itemCount, isClient } = useCart();
    const [moreOpen, setMoreOpen] = useState(false);

    // Hide on checkout to avoid overlapping form controls
    if (pathname === '/checkout') return null;

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-around h-[62px] px-2 pb-safe">
                    {navItems.map((item) => {
                        const isActive = !item.isMore && (
                            pathname === item.href ||
                            (item.href !== '/' && item.href && pathname.startsWith(item.href))
                        );

                        if (item.isMore) {
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => setMoreOpen(!moreOpen)}
                                    className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 relative"
                                    aria-label="More options"
                                >
                                    <span className={`transition-colors duration-200 ${moreOpen ? 'text-[#e63946]' : 'text-gray-500'}`}>
                                        {item.icon}
                                    </span>
                                    <span className={`text-[9px] font-semibold tracking-wide ${moreOpen ? 'text-[#e63946]' : 'text-gray-500'}`}>
                                        {item.name}
                                    </span>
                                </button>
                            );
                        }

                        if (item.isCenter) {
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex flex-col transform -translate-x-[13px] items-center -mt-6"
                                    aria-label={item.name}
                                >
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                                        isActive ? 'bg-[#c1121f] scale-105' : 'bg-[#e63946]'
                                    }`}>
                                        <span className="text-white">{item.icon}</span>
                                    </div>
                                    <span className={`text-[9px] font-semibold mt-1 tracking-wide ${
                                        isActive ? 'text-[#e63946]' : 'text-gray-500'
                                    }`}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex flex-col items-center transform -translate-x-[6px] gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 relative"
                                aria-label={item.name}
                            >
                                <span className={`transition-colors duration-200 ${isActive ? 'text-[#e63946]' : 'text-gray-500'}`}>
                                    {item.icon}
                                </span>
                                <span className={`text-[9px] font-semibold tracking-wide ${isActive ? 'text-[#e63946]' : 'text-gray-500'}`}>
                                    {item.name}
                                </span>
                                {item.isCart && isClient && itemCount > 0 && (
                                    <span className="absolute -top-0.5 right-1 bg-[#e63946] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                        {itemCount > 9 ? '9+' : itemCount}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>
            <MobileMoreMenu isOpen={moreOpen} onClose={() => setMoreOpen(false)} />
        </>
    );
}
