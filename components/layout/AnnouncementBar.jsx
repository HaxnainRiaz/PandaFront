'use client';

import { useState, useEffect } from 'react';
import { useCore } from '@/context/CoreContext';
import { Truck, Sparkles, Flame, Package, CreditCard, X } from 'lucide-react';

const messages = [
    { Icon: Truck, text: 'Free Delivery on Orders Over Rs. 4,999!' },
    { Icon: Sparkles, text: 'Trending Products — New Arrivals Every Week!' },
    { Icon: Flame, text: 'Up to 50% OFF on Selected Items!' },
    { Icon: Package, text: 'Fast Shipping Across All Pakistan!' },
    { Icon: CreditCard, text: 'Cash on Delivery Available Nationwide!' },
];

export default function AnnouncementBar() {
    const [isVisible, setIsVisible] = useState(true);
    const [msgIndex, setMsgIndex] = useState(0);
    const { settings } = useCore();

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex(prev => (prev + 1) % messages.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    if (!isVisible) return null;

    const threshold = settings?.shipping?.freeShippingThreshold || 4999;
    const isEnabled = settings?.shipping?.freeShippingEnabled;
    const { Icon: MsgIcon, text: msgText } = isEnabled
        ? { Icon: Truck, text: `Free Delivery on Orders Over Rs. ${threshold.toLocaleString()}!` }
        : messages[msgIndex];

    return (
        <div className="relative z-50 bg-[#e63946] text-white text-xs md:text-sm font-semibold overflow-hidden">
            <div className="flex items-center justify-center py-2.5 px-10 text-center gap-3 min-h-[36px] animate-fadeIn">
                <span className="tracking-wide inline-flex items-center gap-2">
                    <MsgIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    {msgText}
                </span>
            </div>
            <button
                onClick={() => setIsVisible(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Close announcement"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}
