'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from './ToastContext';

import { getApiUrl } from '@/lib/apiConfig';

const StoreAuthContext = createContext();

export function StoreAuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { addToast } = useToast();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const getToken = useCallback(() => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('token');
    }, []);

    const loadUser = useCallback(async () => {
        if (typeof window === 'undefined') {
            setLoading(false);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${getApiUrl()}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setUser(data.data);
            } else {
                localStorage.removeItem("token");
                setUser(null);
            }
        } catch (error) {
            console.error("Error loading user:", error);
            localStorage.removeItem("token");
            setUser(null);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const login = useCallback(async (email, password) => {
        try {
            const res = await fetch(`${getApiUrl()}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem("token", data.token);
                setUser(data.user);
                addToast(`Welcome back, ${data.user.name.split(' ')[0]}!`, 'success');
                router.push("/account");
                return { success: true };
            } else {
                addToast(data.message || "Login failed", 'error');
                return { success: false, message: data.message };
            }
        } catch (error) {
            addToast("Server connection failed", 'error');
            return { success: false, message: "Server error" };
        }
    }, [addToast, router]);

    const register = useCallback(async (name, email, password) => {
        try {
            const res = await fetch(`${getApiUrl()}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, role: 'customer' })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem("token", data.token);
                setUser(data.user);
                addToast("Account created successfully! Welcome to Panda E-Mart.", 'success');
                router.push("/account");
                return { success: true };
            } else {
                addToast(data.message || "Registration failed", 'error');
                return { success: false, message: data.message };
            }
        } catch (error) {
            addToast("Registration failed. Please try again later.", 'error');
            return { success: false, message: "Server error" };
        }
    }, [addToast, router]);

    const logout = useCallback(() => {
        setUser(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem("token");
        }
        addToast("Signed out successfully", 'info');
        router.push('/');
    }, [addToast, router]);

    // --- Wishlist & Addresses ---

    const toggleWishlist = useCallback(async (productId) => {
        if (!user) {
            router.push('/account/login');
            return false;
        }

        const token = getToken();
        if (!token) {
            router.push('/account/login');
            return false;
        }
        const isWishlisted = user?.wishlist?.includes(productId);

        // Optimistic update
        const previousWishlist = [...(user.wishlist || [])];
        const newWishlist = isWishlisted
            ? previousWishlist.filter(id => id !== productId)
            : [...previousWishlist, productId];

        setUser(prev => ({ ...prev, wishlist: newWishlist }));

        const method = isWishlisted ? 'DELETE' : 'POST';

        try {
            const res = await fetch(`${getApiUrl()}/users/wishlist/${productId}`, {
                method,
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                // Confirm with server's data
                setUser(prev => ({ ...prev, wishlist: data.data }));
                return true;
            } else {
                // Revert if error
                setUser(prev => ({ ...prev, wishlist: previousWishlist }));
                addToast(data.message || "Failed to update wishlist", 'error');
            }
        } catch (err) {
            console.error(err);
            setUser(prev => ({ ...prev, wishlist: previousWishlist }));
            addToast("Connection error. Wishlist not synced.", 'error');
        }
        return false;
    }, [getToken, router, user, addToast]);

    const addAddress = useCallback(async (address) => {
        const token = getToken();
        if (!token) return false;
        try {
            const res = await fetch(`${getApiUrl()}/users/addresses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(address)
            });
            const data = await res.json();
            if (data.success) {
                setUser(prev => ({ ...prev, addresses: data.data }));
                addToast("Address added successfully", 'success');
                return true;
            }
        } catch (err) {
            console.error(err);
        }
        return false;
    }, [addToast, getToken]);

    const deleteAddress = useCallback(async (addressId) => {
        const token = getToken();
        if (!token) return false;
        try {
            const res = await fetch(`${getApiUrl()}/users/addresses/${addressId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setUser(prev => ({ ...prev, addresses: data.data }));
                addToast("Address removed", 'info');
                return true;
            }
        } catch (err) {
            console.error(err);
        }
        return false;
    }, [addToast, getToken]);

    const updateProfile = useCallback(async (profileData) => {
        const token = getToken();
        if (!token) return false;
        try {
            const res = await fetch(`${getApiUrl()}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });
            const data = await res.json();
            if (data.success) {
                setUser(data.data);
                addToast("Profile updated successfully", 'success');
                return true;
            } else {
                addToast(data.message || "Failed to update profile", 'error');
            }
        } catch (err) {
            console.error(err);
            addToast("Server error updating profile", 'error');
        }
        return false;
    }, [addToast, getToken]);

    const getOrders = useCallback(async () => {
        const token = getToken();
        if (!token) return [];
        try {
            const res = await fetch(`${getApiUrl()}/users/my-orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            return data.data;
        } catch (err) {
            console.error(err);
            return [];
        }
    }, [getToken]);

    const value = useMemo(() => ({
        user,
        loading: loading || !isClient,
        login,
        register,
        logout,
        toggleWishlist,
        addAddress,
        deleteAddress,
        getOrders,
        updateProfile
    }), [
        user,
        loading,
        isClient,
        login,
        register,
        logout,
        toggleWishlist,
        addAddress,
        deleteAddress,
        getOrders,
        updateProfile
    ]);

    return (
        <StoreAuthContext.Provider value={value}>
            {children}
        </StoreAuthContext.Provider>
    );
}

export const useStoreAuth = () => useContext(StoreAuthContext);
