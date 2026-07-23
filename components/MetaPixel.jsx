"use client";

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { fetchMetaConfig, initMetaPixel, trackMetaEvent, grantCookieConsent, denyCookieConsent } from '@/lib/metaPixel';
import { Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MetaPixel Component with Integrated Consent Gate
 * Manages user cookie preference and global Pixel & CAPI tracking signals.
 */
export default function MetaPixel() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const initialized = useRef(false);
    const [consent, setConsent] = useState(null);
    const [config, setConfig] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedConsent = localStorage.getItem('cookie_consent');
        setConsent(storedConsent);

        const setup = async () => {
            const metaConfigData = await fetchMetaConfig();
            setConfig(metaConfigData);
            
            if (metaConfigData?.success && metaConfigData?.isPixelEnabled && metaConfigData?.pixelId) {
                // If consent was not explicitly declined ('false'), initialize and track PageView
                if (storedConsent !== 'false') {
                    initMetaPixel(metaConfigData.pixelId);
                    if (!initialized.current) {
                        trackMetaEvent('PageView');
                        initialized.current = true;
                    }
                }
            }
        };

        setup();
    }, []);

    // Track PageView on route change (unless consent has been explicitly declined)
    useEffect(() => {
        if (initialized.current && consent !== 'false') {
            trackMetaEvent('PageView');
        }
    }, [pathname, searchParams, consent]);

    const handleAccept = () => {
        setConsent('true');
        grantCookieConsent(config?.pixelId);
        initialized.current = true;
        trackMetaEvent('PageView');
    };

    const handleDecline = () => {
        setConsent('false');
        denyCookieConsent();
    };

    // Render nothing if not mounted, tracking disabled, or consent decided
    if (!mounted || !config?.isPixelEnabled || !config?.pixelId || consent !== null) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full p-6 bg-white/90 backdrop-blur-md border border-[#f4a261]/30 rounded-3xl shadow-[0_20px_50px_rgba(10,64,25,0.12)] flex flex-col gap-4"
            >
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#1a1a2e]/5 border border-[#1a1a2e]/10 rounded-2xl text-[#1a1a2e]">
                        <Cookie size={20} className="animate-pulse" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <h4 className="text-sm font-bold text-[#1a1a2e]">
                            Cookie Preference
                        </h4>
                        <p className="text-[11px] text-neutral-500 leading-relaxed">
                            We use cookies and tracking signals to personalize your shopping experience, track site traffic, and optimize our campaigns.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                    <button
                        onClick={handleDecline}
                        className="flex-1 py-2.5 px-4 text-xs font-bold text-neutral-500 hover:text-[#1a1a2e] bg-neutral-100 hover:bg-neutral-200 border border-transparent rounded-2xl transition-all duration-300 cursor-pointer active:scale-95"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-[#1a1a2e] hover:bg-[#083013] border border-[#1a1a2e] hover:border-[#083013] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                    >
                        Accept All
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
