'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useStoreAuth } from '@/context/StoreAuthContext';

const moreLinks = [
    { name: 'About Us', href: '/about', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Contact', href: '/contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'Wishlist', href: '/wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { name: 'Shipping Policy', href: '/shipping-policy', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
    { name: 'Refund Policy', href: '/refund-policy', icon: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6' },
];

export default function MobileMoreMenu({ isOpen, onClose }) {
    const { user } = useStoreAuth();

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
                onClick={onClose}
            />
            <div className="fixed bottom-[62px] left-0 right-0 z-[60] md:hidden animate-slideUp">
                <div className="mx-3 mb-2 bg-white rounded-[16px] shadow-[0_-8px_40px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                        <span className="text-[13px] font-bold text-[#1a1a2e]">More</span>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-gray-100 rounded-[8px] text-gray-400"
                            aria-label="Close more menu"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-1 p-3">
                        {moreLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={onClose}
                                className="flex flex-col items-center gap-1.5 p-3 rounded-[12px] hover:bg-[#e63946]/5 transition-colors"
                            >
                                <svg className="w-5 h-5 text-[#e63946]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={link.icon} />
                                </svg>
                                <span className="text-[10px] font-semibold text-[#2b2b3b] text-center leading-tight">{link.name}</span>
                            </Link>
                        ))}
                        <Link
                            href={user ? '/account' : '/account/login'}
                            onClick={onClose}
                            className="flex flex-col items-center gap-1.5 p-3 rounded-[12px] hover:bg-[#e63946]/5 transition-colors"
                        >
                            <svg className="w-5 h-5 text-[#e63946]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-[10px] font-semibold text-[#2b2b3b] text-center leading-tight">
                                {user ? 'Account' : 'Sign In'}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
