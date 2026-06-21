'use client';

import Link from 'next/link';
import Image from 'next/image';
import PageHero from '@/components/ui/PageHero';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { formatPrice, resolveImageUrl } from '@/lib/utils';
import { useCore } from '@/context/CoreContext';
import { Minus, Plus, Trash2, ShieldCheck, Truck } from 'lucide-react';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, total, itemCount } = useCart();
    const { settings } = useCore();

    const threshold = settings?.shipping?.freeShippingThreshold || 0;
    const qtyThreshold = settings?.shipping?.freeShippingQuantityThreshold || 0;
    const mode = settings?.shipping?.freeShippingMode || 'either';
    const isEnabled = settings?.shipping?.freeShippingEnabled || false;

    let shipping = settings?.shipping?.fee ?? 200;

    if (isEnabled) {
        const amountThresholdMet = threshold > 0 && total >= threshold;
        const quantityThresholdMet = qtyThreshold > 0 && itemCount >= qtyThreshold;
        let freeBySettings = false;
        if (mode === 'amount') freeBySettings = amountThresholdMet;
        else if (mode === 'quantity') freeBySettings = quantityThresholdMet;
        else if (mode === 'both') freeBySettings = amountThresholdMet && quantityThresholdMet;
        else freeBySettings = amountThresholdMet || quantityThresholdMet;
        if (freeBySettings) shipping = 0;
    }

    const grandTotal = total + shipping;

    return (
        <div className="min-h-screen bg-[#f8f9fa] page-with-bottom-actions">
            <PageHero title="Shopping Cart" subtitle={cart.length > 0 ? `${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart` : 'Your cart is waiting for great products'} />

            <Container className="py-8 md:py-12">
                {cart.length === 0 ? (
                    <div className="text-center py-16 md:py-24 bg-white rounded-[16px] border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 mx-auto mb-6 bg-[#e63946]/10 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-[#e63946]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-xl md:text-2xl font-extrabold text-[#1a1a2e] mb-3">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8">Discover trending products and add them to your cart</p>
                        <Link href="/shop"><Button size="lg">Start Shopping</Button></Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="bg-white rounded-[14px] p-4 md:p-5 border border-gray-100 shadow-sm">
                                    <div className="flex gap-4">
                                        <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 bg-gray-50 rounded-[10px] overflow-hidden">
                                            <Image src={resolveImageUrl(item.image)} alt={item.title} fill className="object-cover" sizes="112px" unoptimized />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2 mb-2">
                                                <Link href={`/product/${item.slug}`} className="font-bold text-[#1a1a2e] hover:text-[#e63946] transition-colors line-clamp-2 text-[14px] md:text-[15px]">
                                                    {item.title}
                                                </Link>
                                                <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-[#e63946] transition-colors p-1 flex-shrink-0" aria-label="Remove item">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-lg font-extrabold text-[#1a1a2e] mb-3">{formatPrice(item.price)}</p>
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center border border-gray-200 rounded-[10px] overflow-hidden">
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-2 hover:bg-gray-50 transition-colors" aria-label="Decrease">
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="px-4 py-2 text-sm font-bold min-w-[2.5rem] text-center border-x border-gray-200">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-2 hover:bg-gray-50 transition-colors" aria-label="Increase">
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    Subtotal: <span className="font-bold text-[#1a1a2e]">{formatPrice(item.price * item.quantity)}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-[14px] p-6 border border-gray-100 shadow-sm sticky top-24 space-y-5">
                                <h2 className="text-xl font-extrabold text-[#1a1a2e]">Order Summary</h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Subtotal ({itemCount} items)</span>
                                        <span className="font-semibold">{formatPrice(total)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Shipping</span>
                                        <span className="font-semibold">{shipping === 0 ? <span className="text-[#10b981]">FREE</span> : formatPrice(shipping)}</span>
                                    </div>
                                    {isEnabled && shipping > 0 && threshold > 0 && (
                                        <p className="text-xs text-[#f4a261] bg-[#f4a261]/10 px-3 py-2 rounded-[8px]">
                                            Add {formatPrice(threshold - total)} more for free shipping!
                                        </p>
                                    )}
                                    <div className="border-t border-gray-100 pt-4 flex justify-between text-lg">
                                        <span className="font-extrabold text-[#1a1a2e]">Total</span>
                                        <span className="font-extrabold text-[#e63946]">{formatPrice(grandTotal)}</span>
                                    </div>
                                </div>
                                <Link href="/checkout"><Button className="w-full" size="lg">Proceed to Checkout</Button></Link>
                                <Link href="/shop"><Button variant="outline" className="w-full">Continue Shopping</Button></Link>
                                <div className="space-y-2.5 pt-2 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-xs text-gray-500"><ShieldCheck size={14} className="text-[#10b981]" /> Secure checkout</div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500"><Truck size={14} className="text-[#e63946]" /> Fast delivery across Pakistan</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Container>
        </div>
    );
}
