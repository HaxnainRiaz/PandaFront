/**
 * Meta Pixel & Conversions API Tracking Service
 * This service handles browser-side tracking and prepares data for server-side deduplication.
 */

import { getApiUrl } from './apiConfig';

let metaConfig = null;
let pixelInitialized = false;

/**
 * Generates a standard RFC4122 v4 UUID
 */
const generateUUID = () => {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

/**
 * Fetches public-safe Meta config from backend
 */
export const fetchMetaConfig = async () => {
    try {
        const res = await fetch(`${getApiUrl()}/store/meta/config`, {
            cache: 'no-store'
        });
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

/**
 * Dynamically injects Meta Pixel script and initializes it
 */
export const initMetaPixel = (pixelId) => {
    if (typeof window === 'undefined') return;
    if (!pixelId || pixelInitialized) return;

    if (localStorage.getItem('cookie_consent') !== 'true') {
        if (process.env.NODE_ENV === 'development') {
            console.log('[Meta Pixel] Initialization deferred: Cookie consent not granted.');
        }
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

/**
 * Cookie utilities for CAPI match keys
 */
export const getCookie = (name) => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
};

/**
 * Parses and retrieves fbp (Facebook Browser Pool Cookie)
 */
export const getFbp = () => {
    if (typeof window === 'undefined') return null;
    
    let fbp = getCookie('_fbp');
    if (fbp) return fbp;
    
    fbp = localStorage.getItem('meta_fbp');
    if (fbp) return fbp;
    
    // Generate a fallback fbp to maximize event matching quality
    const rand = Math.round(Math.random() * 2147483647);
    const creationTime = Date.now();
    const generatedFbp = `fb.1.${creationTime}.${rand}`;
    
    localStorage.setItem('meta_fbp', generatedFbp);
    try {
        document.cookie = `_fbp=${generatedFbp}; path=/; max-age=7776000; domain=${window.location.hostname}; SameSite=Lax; Secure`;
    } catch (e) {}
    
    return generatedFbp;
};

/**
 * Parses and retrieves fbc (Facebook Click Identifier Cookie)
 * Recovers from URL query parameter fbclid, stores in localStorage and cookie
 */
export const getFbc = () => {
    if (typeof window === 'undefined') return null;
    
    let fbc = getCookie('_fbc');
    if (fbc) return fbc;
    
    fbc = localStorage.getItem('meta_fbc');
    if (fbc) return fbc;
    
    // Reconstruct from URL parameter fbclid
    const urlParams = new URLSearchParams(window.location.search);
    const fbclid = urlParams.get('fbclid');
    if (fbclid) {
        const creationTime = Date.now();
        const generatedFbc = `fb.1.${creationTime}.${fbclid}`;
        
        localStorage.setItem('meta_fbc', generatedFbc);
        try {
            document.cookie = `_fbc=${generatedFbc}; path=/; max-age=7776000; domain=${window.location.hostname}; SameSite=Lax; Secure`;
        } catch (e) {}
        
        return generatedFbc;
    }
    
    return null;
};

/**
 * Builds a stable event ID for deduplication
 */
export const buildEventId = (prefix, id = '') => {
    const cleanId = id ? String(id).replace(/[^\w-]/g, '') : generateUUID().substring(0, 8);
    return `${prefix}_${cleanId}`;
};

/**
 * Tracks a double-signal event (Browser Pixel + Server Conversions API)
 * Employs navigator.sendBeacon/keepalive fetch for zero checkout friction.
 */
export const trackMetaEvent = async (eventName, payload = {}, eventId = null) => {
    if (typeof window === 'undefined') return null;

    if (localStorage.getItem('cookie_consent') !== 'true') {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Meta Pixel] Event tracking skipped for ${eventName}: Cookie consent not granted.`);
        }
        return null;
    }

    // 1. Resolve configuration
    if (!metaConfig) {
        await fetchMetaConfig();
    }

    if (metaConfig && !metaConfig.isPixelEnabled) return null;
    
    // Check if event is enabled in settings
    if (metaConfig?.enabledEvents && Array.isArray(metaConfig.enabledEvents)) {
        if (!metaConfig.enabledEvents.includes(eventName)) return null;
    }

    // 2. Determine deduplication event ID
    const resolvedEventId = eventId || buildEventId(eventName.toLowerCase());

    // 3. Browser Signal (Direct Meta Pixel)
    if (window.fbq) {
        window.fbq('track', eventName, payload, { eventID: resolvedEventId });
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Meta Pixel Browser] Tracked: ${eventName}`, payload, { eventID: resolvedEventId });
        }
    } else {
        console.warn(`[Meta Pixel Browser] Direct fbq not initialized. Skipping browser signal for ${eventName}.`);
    }

    // 4. Server Signal (Mirror to Conversions API)
    // Avoid double queueing Purchase server-side because orderController handles it directly
    if (metaConfig?.hasCapiToken && eventName !== 'Purchase') {
        const fbp = getFbp();
        const fbc = getFbc();

        const serverPayload = {
            eventName,
            eventId: resolvedEventId,
            eventSourceUrl: window.location.href,
            userData: {
                fbp,
                fbc
            },
            customData: payload
        };

        // Extract orderId from customData/payload if tracking Purchase
        if (payload.order_id && eventName === 'Purchase') {
            serverPayload.orderId = payload.orderId || payload.order_id;
        }

        // Attach user JWT auth token if logged in
        const userToken = localStorage.getItem('token') || getCookie('token');
        const headers = { 'Content-Type': 'application/json' };
        if (userToken) {
            headers['Authorization'] = `Bearer ${userToken}`;
        }

        const url = `${getApiUrl()}/tracking/meta/event`;

        // Send asynchronously to server tracking endpoint
        if (navigator.sendBeacon) {
            try {
                // standard Blob handles json payload beautifully via beacon
                const blob = new Blob([JSON.stringify(serverPayload)], { type: 'application/json' });
                navigator.sendBeacon(url, blob);
            } catch (beaconErr) {
                // fall back to keepalive fetch
                fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(serverPayload),
                    keepalive: true
                }).catch(e => console.error('[Meta CAPI Fetch Fallback Error]:', e.message));
            }
        } else {
            fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(serverPayload),
                keepalive: true
            }).catch(e => console.error('[Meta CAPI Fetch Error]:', e.message));
        }
    }

    return resolvedEventId;
};

/**
 * Grants cookie consent, stores preference, and initializes Pixel
 */
export const grantCookieConsent = (pixelId) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cookie_consent', 'true');
    if (pixelId) {
        initMetaPixel(pixelId);
    } else if (metaConfig?.pixelId) {
        initMetaPixel(metaConfig.pixelId);
    }
};

/**
 * Denies cookie consent, stores preference
 */
export const denyCookieConsent = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cookie_consent', 'false');
};
