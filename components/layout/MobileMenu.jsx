'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useStoreAuth } from '@/context/StoreAuthContext';
import { Flame } from 'lucide-react';

export default function MobileMenu({ isOpen, onClose, navigation }) {
    const { user } = useStoreAuth();

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-[300px] bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <Link href="/" onClick={onClose} className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-[8px] bg-[#e63946] flex items-center justify-center">
                            <span className="text-white font-black text-xs">P</span>
                        </div>
                        <span className="text-base font-extrabold text-[#1a1a2e]">
                            Panda<span className="text-[#e63946]">E-Mart</span>
                        </span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-[8px] transition-colors text-gray-500"
                        aria-label="Close menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="px-4 py-6 space-y-1">
                    {navigation.map((item, i) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onClose}
                            className="flex items-center px-4 py-3 text-[14px] font-semibold text-[#2b2b3b] hover:text-[#e63946] hover:bg-[#e63946]/8 rounded-[10px] transition-all duration-200"
                            style={{ animationDelay: `${i * 60}ms` }}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Divider */}
                <div className="mx-4 border-t border-gray-100" />

                {/* Secondary Links */}
                <div className="px-4 py-4 space-y-1">
                    <Link href="/wishlist" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#6b7280] hover:text-[#e63946] hover:bg-gray-50 rounded-[10px] transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        Wishlist
                    </Link>
                    <Link href={user ? '/account' : '/account/login'} onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#6b7280] hover:text-[#e63946] hover:bg-gray-50 rounded-[10px] transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        {user ? 'My Account' : 'Sign In'}
                    </Link>
                    <Link href="/cart" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#6b7280] hover:text-[#e63946] hover:bg-gray-50 rounded-[10px] transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        Cart
                    </Link>
                </div>

                {/* Bottom CTA */}
                <div className="absolute bottom-6 left-4 right-4">
                    <div className="bg-gradient-to-r from-[#e63946] to-[#f4a261] rounded-[12px] p-4 text-white text-center">
                        <p className="text-xs font-bold mb-1 inline-flex items-center justify-center gap-1.5">
                            <Flame className="w-3.5 h-3.5" />
                            Hot Deals Today
                        </p>
                        <p className="text-[11px] opacity-90">Free delivery on orders Rs. 4,999+</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
