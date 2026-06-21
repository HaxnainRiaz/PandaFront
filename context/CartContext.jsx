'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart as addToCartUtil, removeFromCart as removeFromCartUtil, updateCartItemQuantity as updateQuantityUtil, clearCart as clearCartUtil, getCartTotal, getCartItemCount, addMultipleToCart } from '@/lib/cart';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isClient, setIsClient] = useState(false);

    // Initialize cart from localStorage on mount
    useEffect(() => {
        setIsClient(true);
        setCart(getCart());
    }, []);

    // Listen for storage events to sync across tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'lifestyle-cart') {
                setCart(getCart());
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const addToCart = (product, quantity = 1) => {
        // Sync Cart with Stock Validation
        // Ensure we check against the ID stored in the cart (usually .id or ._id mapped)
        const targetId = product.id || product._id;
        const currentItem = cart.find(item => item.id === targetId);
        const currentQty = currentItem ? currentItem.quantity : 0;
        const totalRequested = currentQty + quantity;

        // Check stock if available
        if (product.stock !== undefined && totalRequested > product.stock) {
            alert(`Sorry, only ${product.stock} units available in stock.`);
            return false;
        }

        // Ensure we pass an object with 'id' if 'id' is missing but '_id' is present
        const productToSave = product.id ? product : { ...product, id: product._id };

        const updatedCart = addToCartUtil(productToSave, quantity);
        setCart([...updatedCart]);
        return true;
    };

    const addBundleToCart = (bundleProducts) => {
        // bundleProducts is array of { product, quantity }
        const updatedCart = addMultipleToCart(bundleProducts);
        setCart([...updatedCart]);
        return true;
    };

    const removeFromCart = (productId) => {
        const updatedCart = removeFromCartUtil(productId);
        setCart([...updatedCart]);
    };

    const updateQuantity = (productId, quantity) => {
        // We accept productId directly now.
        // Stock check removed for now as we don't strictly have the product object here
        // and preventing user action is worse than post-validation.

        const updatedCart = updateQuantityUtil(productId, quantity);
        setCart([...updatedCart]);
        return true;
    };

    const clearCart = () => {
        const updatedCart = clearCartUtil();
        setCart(updatedCart);
    };

    const total = getCartTotal(cart);
    const itemCount = getCartItemCount(cart);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            addBundleToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            total,
            itemCount,
            isClient
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
