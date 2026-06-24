'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getApiUrl, getSocketUrl } from '@/lib/apiConfig';

const ReviewsContext = createContext();

export function ReviewsProvider({ children }) {
    const [reviews, setReviews] = useState({}); // { [productId]: Review[] }
    const [isClient, setIsClient] = useState(true);

    const fetchReviews = useCallback(async (productId) => {
        try {
            const res = await fetch(`${getApiUrl()}/reviews/product/${productId}`);
            const data = await res.json();

            if (data.success) {
                setReviews(prev => ({
                    ...prev,
                    [productId]: data.data
                }));
            }
        } catch (err) {
            console.error("Failed to fetch reviews", err);
        }
    }, []);

    const addReview = async (productId, reviewData) => {
        const token = localStorage.getItem("token");

        try {
            let imageUrls = [];

            // 1. If there's an image, upload it first
            if (reviewData.image) {
                // Convert base64 to File object if it's base64, or just handle it if it's already a File/Blob
                // Actually, ProductReviews uses reader.readAsDataURL, so it's a data URL.
                // We can send the data URL to a specialized endpoint or convert it here.
                // The /api/upload endpoint expects a multipart form-data.

                const blob = await (await fetch(reviewData.image)).blob();
                const formData = new FormData();
                formData.append('image', blob, `review-${Date.now()}.png`);

                const uploadRes = await fetch(`${getApiUrl()}/upload`, {
                    method: 'POST',
                    body: formData
                });
                const uploadData = await uploadRes.json();

                if (uploadData.success) {
                    imageUrls.push(uploadData.url);
                }
            }

            const payload = {
                product: productId,
                ...reviewData,
                images: imageUrls
            };
            delete payload.image;

            const res = await fetch(`${getApiUrl()}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (data.success) {
                await fetchReviews(productId);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (err) {
            console.error("Review Post Error:", err);
            return { success: false, message: err.message };
        }
    };

    const getReviews = (productId) => {
        return reviews[productId] || [];
    };

    // --- WebSocket Integration ---
    useEffect(() => {
        const socketUrl = getSocketUrl();

        let socket;

        import('socket.io-client').then(({ io }) => {
            socket = io(socketUrl, {
                transports: ['websocket'],
                reconnection: true,
            });

            socket.on('connect', () => console.log('🟢 Reviews Connected to WebSocket'));

            // Listen for review updates (Approvals, Admin Replies)
            socket.on('review:update', (updatedReview) => {
                setReviews(prev => {
                    const productId = updatedReview.product._id || updatedReview.product;
                    if (!prev[productId]) return prev;

                    // Only add/update if APPROVED
                    if (updatedReview.status === 'approved') {
                        const existing = prev[productId].find(r => r._id === updatedReview._id);
                        if (existing) {
                            return {
                                ...prev,
                                [productId]: prev[productId].map(r => r._id === updatedReview._id ? updatedReview : r)
                            };
                        } else {
                            return {
                                ...prev,
                                [productId]: [updatedReview, ...prev[productId]]
                            };
                        }
                    } else {
                        // If status changed to something else (e.g. pending/rejected), remove it
                        return {
                            ...prev,
                            [productId]: prev[productId].filter(r => r._id !== updatedReview._id)
                        };
                    }
                });
            });

            // Listen for new reviews
            socket.on('review:new', (newReview) => {
                if (newReview.status === 'approved') {
                    setReviews(prev => {
                        const productId = newReview.product._id || newReview.product;
                        if (prev[productId]) {
                            return {
                                ...prev,
                                [productId]: [newReview, ...prev[productId]]
                            };
                        }
                        return prev;
                    });
                }
            });
        });

        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    return (
        <ReviewsContext.Provider value={{
            reviews,
            fetchReviews,
            addReview,
            getReviews,
            isClient
        }}>
            {children}
        </ReviewsContext.Provider>
    );
}

export function useReviews() {
    const context = useContext(ReviewsContext);
    if (!context) {
        throw new Error('useReviews must be used within a ReviewsProvider');
    }
    return context;
}
