/**
 * Meta Pixel & Conversions API Tracking Service
 * Handles browser-side tracking and mirrors events to server CAPI with shared event_id.
 */

import { getApiUrl } from './apiConfig';

let metaConfig = null;
let pixelInitialized = false;

const generateUUID = () => {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const fetchMetaConfig = async () => {
    try {
        const res = await fetch(`${getApiUrl()}/store/meta/config`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
            metaConfig = data;
        }
        return data;
    } catch (error) {
        console.error('Failed to fetch Meta config:', error);
        return { success: false, isPixelEnabled: false };
    }
};

export const initMetaPixel = (pixelId) => {
    if (typeof window === 'undefined') return;
    if (!pixelId || pixelInitialized) return;

    if (localStorage.getItem('cookie_consent') !== 'true') {
        return;
    }

    !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', pixelId);
    pixelInitialized = true;
};

export const getCookie = (name) => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
};

/**
 * Read _fbp cookie only — do not fabricate when Meta Pixel has not set it.
 */
export const getFbp = () => {
    if (typeof window === 'undefined') return null;
    const cookieFbp = getCookie('_fbp');
    if (cookieFbp) return cookieFbp;
    return localStorage.getItem('meta_fbp') || null;
};

/**
 * Read _fbc or reconstruct from fbclid URL param when present.
 */
export const getFbc = () => {
    if (typeof window === 'undefined') return null;

    const cookieFbc = getCookie('_fbc');
    if (cookieFbc) return cookieFbc;

    const storedFbc = localStorage.getItem('meta_fbc');
    if (storedFbc) return storedFbc;

    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');
    if (fbclid) {
        const generatedFbc = `fb.1.${Date.now()}.${fbclid}`;
        localStorage.setItem('meta_fbc', generatedFbc);
        try {
            document.cookie = `_fbc=${generatedFbc}; path=/; max-age=7776000; SameSite=Lax; Secure`;
        } catch (e) { /* ignore */ }
        return generatedFbc;
    }

    return null;
};

export const buildEventId = (prefix, id = '') => {
    const cleanId = id ? String(id).replace(/[^\w-]/g, '') : generateUUID().substring(0, 8);
    return `${prefix}_${cleanId}`;
};

/**
 * Deterministic Purchase event ID for browser/server deduplication.
 */
export const buildPurchaseEventId = (orderId) => {
    const cleanId = String(orderId).replace(/[^\w-]/g, '');
    return `purchase_${cleanId}`;
};

const hasPurchaseBeenTracked = (orderId) => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(`meta_purchase_${orderId}`) === '1';
};

const markPurchaseTracked = (orderId) => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(`meta_purchase_${orderId}`, '1');
};

/**
 * Tracks browser Pixel + mirrors to server CAPI with identical event_id.
 */
export const trackMetaEvent = async (eventName, payload = {}, eventId = null) => {
    if (typeof window === 'undefined') return null;

    if (localStorage.getItem('cookie_consent') !== 'true') {
        return null;
    }

    if (!metaConfig) {
        await fetchMetaConfig();
    }

    if (metaConfig && !metaConfig.isPixelEnabled) return null;

    if (metaConfig?.enabledEvents && Array.isArray(metaConfig.enabledEvents)) {
        if (!metaConfig.enabledEvents.includes(eventName)) return null;
    }

    const resolvedEventId = eventId || buildEventId(eventName.toLowerCase());

    if (eventName === 'Purchase' && payload.order_id && hasPurchaseBeenTracked(payload.order_id)) {
        return resolvedEventId;
    }

    if (window.fbq) {
        window.fbq('track', eventName, payload, { eventID: resolvedEventId });
    }

    if (eventName === 'Purchase' && payload.order_id) {
        markPurchaseTracked(payload.order_id);
    }

    // Purchase CAPI is sent server-side from orderController — browser fires Pixel only
    if (metaConfig?.hasCapiToken && eventName !== 'Purchase') {
        const fbp = getFbp();
        const fbc = getFbc();

        const serverPayload = {
            eventName,
            eventId: resolvedEventId,
            eventSourceUrl: window.location.href,
            userData: { fbp, fbc },
            customData: payload
        };

        const userToken = localStorage.getItem('token') || getCookie('token');
        const headers = { 'Content-Type': 'application/json' };
        if (userToken) {
            headers['Authorization'] = `Bearer ${userToken}`;
        }

        const url = `${getApiUrl()}/tracking/meta/event`;

        fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(serverPayload),
            keepalive: true
        }).catch(e => console.error('[Meta CAPI Mirror Error]:', e.message));
    }

    return resolvedEventId;
};

export const grantCookieConsent = (pixelId) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cookie_consent', 'true');
    if (pixelId) {
        initMetaPixel(pixelId);
    } else if (metaConfig?.pixelId) {
        initMetaPixel(metaConfig.pixelId);
    }
};

export const denyCookieConsent = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cookie_consent', 'false');
};
