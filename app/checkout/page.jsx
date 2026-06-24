'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCart } from '@/hooks/useCart';
import { formatPrice, resolveImageUrl } from '@/lib/utils';
import { useStoreAuth } from '@/context/StoreAuthContext';
import { useCore } from '@/context/CoreContext';
import { fetchMetaConfig, trackMetaEvent, getFbp, getFbc } from '@/lib/metaPixel';

import { getApiUrl } from '@/lib/apiConfig';

export default function CheckoutPage() {
    const { cart, total, clearCart } = useCart();
    const { user, loading: authLoading } = useStoreAuth();
    const { settings } = useCore();
    const router = useRouter();

    const [couponInput, setCouponInput] = useState('');
    const [couponCode, setCouponCode] = useState(null); // Validated code
    const [discountData, setDiscountData] = useState(null); // Full coupon object
    const [couponError, setCouponError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [apiError, setApiError] = useState('');

    const [hasFiredInit, setHasFiredInit] = useState(false);

    // Track InitiateCheckout
    useEffect(() => {
        const init = async () => {
            const config = await fetchMetaConfig();
            if (config?.success && config?.isPixelEnabled && cart.length > 0 && !hasFiredInit) {
                const eventId = `init_${Date.now()}`;
                trackMetaEvent('InitiateCheckout', {
                    content_ids: cart.map(item => item.id || item._id),
                    content_type: 'product',
                    value: total,
                    currency: 'PKR',
                    num_items: cart.reduce((acc, item) => acc + item.quantity, 0),
                    contents: cart.map(item => ({ id: item.id || item._id, quantity: item.quantity }))
                }, eventId);
                setHasFiredInit(true);
            }
        };
        init();
    }, [cart.length, hasFiredInit]);

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        country: 'Pakistan',
        phone: '',
    });

    // Protect Route & Prefill Data
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                email: user.email,
                firstName: user.name.split(' ')[0] || '',
                lastName: user.name.split(' ').slice(1).join(' ') || ''
            }));

            // Prefill address if available
            if (user.addresses && user.addresses.length > 0) {
                const def = user.addresses.find(a => a.isDefault) || user.addresses[0];
                setFormData({
                    email: user.email,
                    firstName: def.fullName?.split(' ')[0] || user.name.split(' ')[0],
                    lastName: def.fullName?.split(' ').slice(1).join(' ') || '',
                    address: def.street,
                    city: def.city,
                    state: def.state,
                    country: def.country,
                    phone: def.phone
                });
            }
        }
    }, [user, authLoading]);

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setCouponError('');

        try {
            const res = await fetch(`${getApiUrl()}/coupons/validate/${couponInput}`);
            const data = await res.json();

            if (data.success) {
                const coupon = data.data;
                if (total < coupon.minAmount) {
                    setCouponError(`Minimum spend of ${formatPrice(coupon.minAmount)} required`);
                    return;
                }
                setDiscountData(coupon);
                setCouponCode(coupon.code);
            } else {
                setCouponError(data.message || 'Invalid coupon');
                setDiscountData(null);
                setCouponCode(null);
            }
        } catch (error) {
            setCouponError('Error validating coupon');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setApiError('');

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const payload = {
                items: cart.map(item => ({
                    product: item.id || item._id,
                    quantity: item.quantity
                })),
                shippingAddress: {
                    fullName: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email, // Added email to shipping address
                    phone: formData.phone,
                    street: formData.address,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country
                },
                coupon: couponCode,
                // Meta Tracking Data
                fbp: getFbp(),
                fbc: getFbc(),
                eventSourceUrl: typeof window !== 'undefined' ? window.location.href : '',
                metaEventId: `purchase_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
            };

            const res = await fetch(`${getApiUrl()}/orders`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.success) {
                const order = data.data;
                const stableOrderId = order.orderNumber || order._id;
                const eventId = order.metaEventId || `purchase_${order._id}`;

                // Meta Tracking (Purchase Browser Event)
                trackMetaEvent('Purchase', {
                    content_ids: cart.map(item => item.id || item._id),
                    content_type: 'product',
                    value: total,
                    currency: 'PKR',
                    num_items: cart.reduce((acc, item) => acc + item.quantity, 0),
                    contents: cart.map(item => ({ id: item.id || item._id, quantity: item.quantity })),
                    order_id: stableOrderId
                }, eventId);

                clearCart();
                setOrderId(stableOrderId);
                setIsSuccess(true);
                window.scrollTo(0, 0);
            } else {
                setApiError(data.message || 'Failed to place order');
            }
        } catch (err) {
            setApiError(err.message || "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) return <div className="py-24 text-center">Loading...</div>;

    if (isSuccess) {
        return (
            <Container className="py-24 text-center animate-fadeIn">
                <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-heading font-bold text-[#1a1a2e] mb-4">Order Confirmed</h1>
                    <p className="text-[#6b7280] mb-8">
                        Thank you for your purchase. Your order <span className="text-[#1a1a2e] font-bold">{orderId?.startsWith('#') ? orderId : `#${orderId.substring(18).toUpperCase()}`}</span> has been placed successfully and is being processed.
                    </p>
                    <div className="space-y-4">
                        <Link href="/shop" className="block w-full">
                            <Button className="w-full">Continue Shopping</Button>
                        </Link>
                        {user ? (
                            <Link href="/account" className="block w-full text-sm font-bold text-[#f4a261] hover:underline">
                                View Order History & Track Status
                            </Link>
                        ) : (
                            <div className="bg-[#d3d3d3]/5 p-6 rounded-2xl border border-[#d3d3d3]/20 mt-8">
                                <p className="text-sm font-bold text-[#1a1a2e] mb-2 italic">Want to track your order in real-time?</p>
                                <p className="text-xs text-[#6b7280] mb-4">Create an account now to see live status updates, management tools, and earn reward points on this purchase.</p>
                                <Link href="/account/login?mode=signup">
                                    <Button variant="secondary" className="w-full py-3 text-[10px] uppercase tracking-widest">Sign Up Now & Track Order</Button>
                                </Link>
                                <p className="text-[10px] text-neutral-400 mt-4 italic">A confirmation email will also be sent to {formData.email}</p>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        );
    }


    if (cart.length === 0) {
        return (
            <Container className="py-24 text-center">
                <h1 className="text-3xl font-heading font-bold text-[#1a1a2e] mb-4">Your cart is empty</h1>
                <Link href="/shop">
                    <Button>Continue Shopping</Button>
                </Link>
            </Container>
        );
    }

    const threshold = settings?.shipping?.freeShippingThreshold || 0;
    const qtyThreshold = settings?.shipping?.freeShippingQuantityThreshold || 0;
    const mode = settings?.shipping?.freeShippingMode || 'either';
    const isEnabled = settings?.shipping?.freeShippingEnabled || false;
    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

    let shipping = settings?.shipping?.fee ?? 200;

    if (isEnabled) {
        const amountThresholdMet = threshold > 0 && total >= threshold;
        const quantityThresholdMet = qtyThreshold > 0 && totalQuantity >= qtyThreshold;

        let freeBySettings = false;
        if (mode === 'amount') {
            freeBySettings = amountThresholdMet;
        } else if (mode === 'quantity') {
            freeBySettings = quantityThresholdMet;
        } else if (mode === 'both') {
            freeBySettings = amountThresholdMet && quantityThresholdMet;
        } else { // 'either'
            freeBySettings = amountThresholdMet || quantityThresholdMet;
        }

        if (freeBySettings) {
            shipping = 0;
        }
    }

    // computation logic
    if (discountData && discountData.discountType === 'free_shipping') {
        shipping = 0;
    }

    const estimatedTax = 0;

    let discount = 0;
    if (discountData) {
        if (discountData.discountType === 'percentage') {
            discount = (total * discountData.discountValue) / 100;
            if (discountData.maxDiscount && discount > discountData.maxDiscount) {
                discount = discountData.maxDiscount;
            }
        } else if (discountData.discountType === 'fixed') {
            discount = discountData.discountValue;
        }
    }

    const estimatedTotal = Math.max(0, total + shipping - discount);

    return (
        <div className="min-h-screen bg-[#f8f9fa] page-with-bottom-actions pb-4">
            <Container className="py-8 md:py-12">
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a1a2e] mb-8" style={{ fontFamily: 'var(--font-plus-jakarta, Inter, sans-serif)' }}>Checkout</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Contact Information */}
                            <div className="bg-white p-6 rounded-[14px] border border-gray-100 shadow-sm">
                                <h2 className="text-xl font-extrabold text-[#1a1a2e] mb-6">
                                    Shipping Information
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        label="First Name"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        label="Last Name"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        label="Address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        className="md:col-span-2"
                                    />
                                    <Input
                                        label="City"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        label="State"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        label="Phone"
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="md:col-span-2"
                                    />
                                </div>
                            </div>

                            {/* Payment Method Stub */}
                            <div className="bg-white p-6 rounded-[14px] border border-gray-100 shadow-sm">
                                <h2 className="text-xl font-extrabold text-[#1a1a2e] mb-6">Payment</h2>
                                <div className="bg-[#f8f9fa] p-4 rounded-[10px] border border-gray-200 text-sm text-[#1a1a2e] flex items-center gap-2">
                                    <span className="text-lg">💳</span> Cash on Delivery selected — pay when your order arrives.
                                </div>
                            </div>

                            {apiError && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                                    {apiError}
                                </div>
                            )}

                            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Processing...' : 'Place Order'}
                            </Button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-[14px] border border-gray-100 shadow-sm sticky top-24">
                            <h2 className="text-xl font-extrabold text-[#1a1a2e] mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-16 h-16 bg-[#e5e7eb] rounded-xl overflow-hidden shrink-0">
                                            <img src={resolveImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-[#1a1a2e] text-sm line-clamp-1">{item.title}</p>
                                            <p className="text-sm text-[#6b7280] font-medium">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-[#1a1a2e] text-sm">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Coupont Input */}
                            <div className="mb-6 pt-6 border-t border-[#e5e7eb]/50">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Promo Code"
                                        className="flex-1"
                                        value={couponInput}
                                        onChange={(e) => setCouponInput(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleApplyCoupon}
                                        className="px-4 py-2 bg-[#e63946] text-white text-xs font-bold rounded-[10px] hover:bg-[#c1121f] active:scale-95 transition-all"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {couponError && (
                                    <div className="mt-2 text-xs text-red-600 font-bold">
                                        {couponError}
                                    </div>
                                )}
                                {couponCode && (
                                    <div className="mt-2 text-xs text-green-600 font-bold">
                                        Code {couponCode} applied successfully!
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-[#e5e7eb] pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#6b7280] font-medium">Subtotal</span>
                                    <span className="font-bold">{formatPrice(total)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600 font-bold animate-fadeIn">
                                        <span>Discount ({couponCode})</span>
                                        <span>-{formatPrice(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#6b7280] font-medium">Shipping Fee</span>
                                    <span className="font-bold">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-heading font-bold pt-4 border-t border-[#e5e7eb] mt-4">
                                    <span className="text-[#1a1a2e]">Total</span>
                                    <span className="text-[#1a1a2e]">{formatPrice(estimatedTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
