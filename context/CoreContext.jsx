'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CoreContext = createContext();

let API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api`;
if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && API_URL.includes('localhost')) {
    API_URL = 'https://store-backend-neon.vercel.app/api';
}

export function CoreProvider({ children }) {
    const [settings, setSettings] = useState({
        announcementBarText: "Free Shipping on Orders Over Rs. 5,000",
        showNewsletterSection: true,
        showFeaturedCollection: true,
    });

    const [banners, setBanners] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const results = await Promise.allSettled([
                fetch(`${API_URL}/products?limit=200`).then(res => res.json()),
                fetch(`${API_URL}/categories`).then(res => res.json()),
                fetch(`${API_URL}/banners`).then(res => res.json()),
                fetch(`${API_URL}/settings`).then(res => res.json()),
            ]);

            const [prodRes, catRes, bannerRes, settingsRes] = results;

            if (prodRes.status === 'fulfilled' && prodRes.value?.success) setProducts(prodRes.value.data);
            if (catRes.status === 'fulfilled' && catRes.value?.success) setCategories(catRes.value.data);
            if (bannerRes.status === 'fulfilled' && bannerRes.value?.success) setBanners(bannerRes.value.data);
            if (settingsRes.status === 'fulfilled' && settingsRes.value?.success) setSettings(settingsRes.value.data);

            setLoading(false);
        } catch (error) {
            console.error("Error fetching store data:", error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
        if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && socketUrl.includes('localhost')) {
            socketUrl = 'https://store-backend-neon.vercel.app';
        }

        import('socket.io-client').then(({ io }) => {
            const socket = io(socketUrl, {
                transports: ['websocket'],
                reconnection: true,
            });

            socket.on('connect', () => {});

            socket.on('product:update', (updatedProduct) => {
                setProducts(prev => prev.map(p => p._id === updatedProduct._id ? { ...p, ...updatedProduct } : p));
            });

            socket.on('product:create', (newProduct) => {
                if (newProduct.status === 'active' || newProduct.status === 'published') {
                    setProducts(prev => [newProduct, ...prev]);
                }
            });

            socket.on('product:delete', ({ id }) => {
                setProducts(prev => prev.filter(p => p._id !== id));
            });

            socket.on('category:update', (cat) => {
                if (cat.delete) {
                    setCategories(prev => prev.filter(c => c._id !== cat.id));
                } else {
                    setCategories(prev => {
                        const exists = prev.find(c => c._id === cat._id);
                        if (exists) return prev.map(c => c._id === cat._id ? cat : c);
                        return [...prev, cat];
                    });
                }
            });

            socket.on('banner:new', (b) => setBanners(prev => [...prev, b]));
            socket.on('banner:update', (b) => setBanners(prev => prev.map(prevB => prevB._id === b._id ? b : prevB)));
            socket.on('banner:delete', ({ id }) => setBanners(prev => prev.filter(b => b._id !== id)));

            socket.on('coupon:new', (c) => setCoupons(prev => [c, ...prev]));
            socket.on('coupon:update', (c) => setCoupons(prev => prev.map(prevC => prevC._id === c._id ? c : prevC)));
            socket.on('coupon:delete', ({ id }) => setCoupons(prev => prev.filter(c => c._id !== id)));

            socket.on('cms:update', (cmsData) => setSettings(prev => ({ ...prev, ...cmsData })));

            return () => {
                socket.disconnect();
            };
        });
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const subscribeNewsletter = async (email) => {
        try {
            const res = await fetch(`${API_URL}/newsletter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            return data;
        } catch (err) {
            return { success: false, message: 'Server error' };
        }
    };

    const submitSupportTicket = async (ticketData) => {
        try {
            const res = await fetch(`${API_URL}/support-tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticketData)
            });
            const data = await res.json();
            return data;
        } catch (err) {
            return { success: false, message: 'Server error' };
        }
    };

    return (
        <CoreContext.Provider value={{
            settings,
            banners,
            products,
            categories,
            coupons,
            loading,
            subscribeNewsletter,
            submitSupportTicket,
            refreshData: fetchData
        }}>
            {children}
        </CoreContext.Provider>
    );
}

export const useCore = () => useContext(CoreContext);
