'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getApiUrl, getSocketUrl, isSocketEnabled } from '@/lib/apiConfig';

const CoreContext = createContext();

const DEFAULT_SETTINGS = {
    announcementBarText: 'Free Delivery on Orders Over Rs. 4,999!',
    showNewsletterSection: true,
    showFeaturedCollection: true,
};

export function CoreProvider({ children }) {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [banners, setBanners] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchedRef = useRef(false);

    const fetchData = useCallback(async (retriesLeft = 2) => {
        setError(null);
        try {
            const res = await fetch(`${getApiUrl()}/store/catalog`, {
                cache: 'default',
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || `Catalog request failed (${res.status})`);
            }

            setProducts(data.data?.products || []);
            setCategories(data.data?.categories || []);
            setBanners(data.data?.banners || []);
            setSettings(data.data?.settings || DEFAULT_SETTINGS);
            setLoading(false);
        } catch (err) {
            if (retriesLeft > 0) {
                await new Promise((r) => setTimeout(r, 400 * (3 - retriesLeft)));
                return fetchData(retriesLeft - 1);
            }
            console.error('Error fetching store catalog:', err);
            setError(err.message || 'Failed to load store data');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (!isSocketEnabled()) return undefined;

        let socket;
        import('socket.io-client').then(({ io }) => {
            socket = io(getSocketUrl(), {
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 2,
            });

            socket.on('product:update', (updatedProduct) => {
                setProducts((prev) => prev.map((p) => (p._id === updatedProduct._id ? { ...p, ...updatedProduct } : p)));
            });

            socket.on('product:create', (newProduct) => {
                if (newProduct.status === 'active' || newProduct.status === 'published') {
                    setProducts((prev) => [newProduct, ...prev]);
                }
            });

            socket.on('product:delete', ({ id }) => {
                setProducts((prev) => prev.filter((p) => p._id !== id));
            });

            socket.on('category:update', (cat) => {
                if (cat.delete) {
                    setCategories((prev) => prev.filter((c) => c._id !== cat.id));
                } else {
                    setCategories((prev) => {
                        const exists = prev.find((c) => c._id === cat._id);
                        if (exists) return prev.map((c) => (c._id === cat._id ? cat : c));
                        return [...prev, cat];
                    });
                }
            });

            socket.on('banner:new', (b) => setBanners((prev) => [...prev, b]));
            socket.on('banner:update', (b) => setBanners((prev) => prev.map((prevB) => (prevB._id === b._id ? b : prevB))));
            socket.on('banner:delete', ({ id }) => setBanners((prev) => prev.filter((b) => b._id !== id)));
            socket.on('coupon:new', (c) => setCoupons((prev) => [c, ...prev]));
            socket.on('coupon:update', (c) => setCoupons((prev) => prev.map((prevC) => (prevC._id === c._id ? c : prevC))));
            socket.on('coupon:delete', ({ id }) => setCoupons((prev) => prev.filter((c) => c._id !== id)));
            socket.on('cms:update', (cmsData) => setSettings((prev) => ({ ...prev, ...cmsData })));
        });

        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    const subscribeNewsletter = async (email) => {
        try {
            const res = await fetch(`${getApiUrl()}/newsletter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            return await res.json();
        } catch (err) {
            return { success: false, message: 'Server error' };
        }
    };

    const submitSupportTicket = async (ticketData) => {
        try {
            const res = await fetch(`${getApiUrl()}/support-tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticketData),
            });
            return await res.json();
        } catch (err) {
            return { success: false, message: 'Server error' };
        }
    };

    return (
        <CoreContext.Provider
            value={{
                settings,
                banners,
                products,
                categories,
                coupons,
                loading,
                error,
                subscribeNewsletter,
                submitSupportTicket,
                refreshData: () => {
                    fetchedRef.current = false;
                    setLoading(true);
                    return fetchData();
                },
            }}
        >
            {children}
        </CoreContext.Provider>
    );
}

export const useCore = () => useContext(CoreContext);
