'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';
import { formatPrice, resolveImageUrl } from '@/lib/utils';

export default function CartDrawer({ isOpen, onClose }) {
    const { cart, removeFromCart, updateQuantity, total, itemCount } = useCart();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white z-50 shadow-[0_16px_60px_#1a1a2e26] overflow-y-auto">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-[#e5e7eb]">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-heading font-semibold text-[#1a1a2e]">
                                Shopping Cart ({itemCount})
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 text-[#1a1a2e] hover:bg-[#1a1a2e1A] rounded-lg transition-colors"
                                aria-label="Close cart"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Cart items */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {cart.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 mx-auto text-[#6b72804C] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <p className="text-[#6b7280] mb-4">Your cart is empty</p>
                                <Button onClick={onClose} variant="primary">
                                    Continue Shopping
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4 bg-[#f8f9fa] rounded-lg">
                                        <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                                            <Image
                                                src={resolveImageUrl(item.image)}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                                unoptimized
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/product/${item.slug}`}
                                                onClick={onClose}
                                                className="font-medium text-[#1a1a2e] hover:text-[#c1121f] transition-colors line-clamp-1"
                                            >
                                                {item.title}
                                            </Link>

                                            <p className="text-sm text-[#6b7280] mt-1">
                                                {formatPrice(item.price)}
                                            </p>

                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-7 h-7 flex items-center justify-center border border-[#e5e7eb] rounded hover:bg-[#1a1a2e] hover:text-white hover:border-[#1a1a2e] transition-colors"
                                                    aria-label="Decrease quantity"
                                                >
                                                    −
                                                </button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-7 h-7 flex items-center justify-center border border-[#e5e7eb] rounded hover:bg-[#1a1a2e] hover:text-white hover:border-[#1a1a2e] transition-colors"
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="ml-auto text-red-500 hover:text-red-600 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {cart.length > 0 && (
                        <div className="border-t border-[#e5e7eb] p-6 space-y-4">
                            <div className="flex justify-between text-lg font-semibold">
                                <span>Subtotal:</span>
                                <span className="text-[#1a1a2e]">{formatPrice(total)}</span>
                            </div>

                            <p className="text-sm text-[#6b7280]">
                                Shipping and taxes calculated at checkout
                            </p>

                            <Link href="/cart" onClick={onClose}>
                                <Button variant="outline" className="w-full mb-2">
                                    View Cart
                                </Button>
                            </Link>

                            <Link href="/checkout" onClick={onClose}>
                                <Button variant="primary" className="w-full">
                                    Checkout
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
