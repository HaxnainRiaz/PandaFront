export function getCart() {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('lifestyle-cart');
    return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('lifestyle-cart', JSON.stringify(cart));
}

export function addToCart(product, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            slug: product.slug,
            price: product.salePrice || product.price,
            originalPrice: product.price,
            image: product.images[0],
            quantity: quantity,
        });
    }

    saveCart(cart);
    return cart;
}

export function addMultipleToCart(products) {
    const cart = getCart();
    
    products.forEach(({ product, quantity = 1 }) => {
        const existingItem = cart.find(item => item.id === product._id || item.id === product.id);
        const targetId = product.id || product._id;

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: targetId,
                title: product.title,
                slug: product.slug,
                price: product.salePrice || product.price,
                originalPrice: product.price,
                image: product.images?.[0],
                quantity: quantity,
            });
        }
    });

    saveCart(cart);
    return cart;
}

export function removeFromCart(productId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
    return updatedCart;
}

export function updateCartItemQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
        if (quantity <= 0) {
            return removeFromCart(productId);
        }
        item.quantity = quantity;
        saveCart(cart);
    }

    return cart;
}

export function clearCart() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('lifestyle-cart');
    return [];
}

export function getCartTotal(cart) {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function getCartItemCount(cart) {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

export function getWishlist() {
    if (typeof window === 'undefined') return [];
    const wishlist = localStorage.getItem('lifestyle-wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
}

export function saveWishlist(wishlist) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('lifestyle-wishlist', JSON.stringify(wishlist));
}

export function addToWishlist(productId) {
    const wishlist = getWishlist();
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        saveWishlist(wishlist);
    }
    return wishlist;
}

export function removeFromWishlist(productId) {
    const wishlist = getWishlist();
    const updated = wishlist.filter(id => id !== productId);
    saveWishlist(updated);
    return updated;
}

export function isInWishlist(productId) {
    const wishlist = getWishlist();
    return wishlist.includes(productId);
}

export function toggleWishlist(productId) {
    if (isInWishlist(productId)) {
        return removeFromWishlist(productId);
    } else {
        return addToWishlist(productId);
    }
}
