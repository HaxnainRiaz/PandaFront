import products from '@/data/products.json';

export function getAllProducts() {
    return products;
}

export function getProductById(id) {
    return products.find(product => product.id === id);
}

export function getProductBySlug(slug) {
    return products.find(product => product.slug === slug);
}

export function getFeaturedProducts() {
    return products.filter(product => product.featured);
}

export function getBestsellers() {
    return products.filter(product => product.bestseller);
}

export function getProductsByCategory(category) {
    return products.filter(product => product.category === category);
}

export function getProductsByConcern(concern) {
    return products.filter(product => product.concerns.includes(concern));
}

export function searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return products.filter(product => {
        const pCats = Array.isArray(product.category) ? product.category : [product.category];
        const catMatch = pCats.some(c => {
            const cVal = typeof c === 'object' && c !== null ? (c.title || '') : String(c);
            return cVal.toLowerCase().includes(lowerQuery);
        });

        return (
            product.title.toLowerCase().includes(lowerQuery) ||
            product.description.toLowerCase().includes(lowerQuery) ||
            catMatch ||
            product.concerns.some(concern => concern.toLowerCase().includes(lowerQuery))
        );
    });
}

export function sortProducts(products, sortBy) {
    const sorted = [...products];

    switch (sortBy) {
        case 'price-asc':
            return sorted.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        case 'price-desc':
            return sorted.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'newest':
            return sorted.reverse();
        default:
            return sorted;
    }
}

export function filterProducts(products, filters) {
    let filtered = [...products];

    if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter(p => {
            const pCats = Array.isArray(p.category) ? p.category : (p.category ? [p.category] : []);
            return pCats.some(c => {
                const cId = typeof c === 'object' && c !== null ? c._id : c;
                return String(cId) === String(filters.category);
            });
        });
    }

    if (filters.concern) {
        filtered = filtered.filter(p => p.concerns.includes(filters.concern));
    }

    if (filters.minPrice !== undefined) {
        filtered = filtered.filter(p => (p.salePrice || p.price) >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
        filtered = filtered.filter(p => (p.salePrice || p.price) <= filters.maxPrice);
    }

    if (filters.inStock) {
        filtered = filtered.filter(p => p.stock > 0);
    }

    return filtered;
}

export const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'serums', label: 'Serums' },
    { value: 'moisturizers', label: 'Moisturizers' },
    { value: 'cleansers', label: 'Cleansers' },
    { value: 'eye-care', label: 'Eye Care' },
    { value: 'toners', label: 'Toners' },
    { value: 'oils', label: 'Face Oils' },
    { value: 'masks', label: 'Masks' },
    { value: 'treatments', label: 'Treatments' },
    { value: 'mists', label: 'Mists' },
    { value: 'sunscreen', label: 'Sunscreen' },
    { value: 'lip-care', label: 'Lip Care' },
];

export const concerns = [
    { value: 'brightening', label: 'Brightening' },
    { value: 'anti-aging', label: 'Anti-Aging' },
    { value: 'dryness', label: 'Dryness' },
    { value: 'sensitivity', label: 'Sensitivity' },
    { value: 'dullness', label: 'Dullness' },
    { value: 'pores', label: 'Large Pores' },
    { value: 'texture', label: 'Uneven Texture' },
    { value: 'dark-circles', label: 'Dark Circles' },
    { value: 'puffiness', label: 'Puffiness' },
    { value: 'fine-lines', label: 'Fine Lines' },
    { value: 'wrinkles', label: 'Wrinkles' },
    { value: 'dehydration', label: 'Dehydration' },
    { value: 'sun-protection', label: 'Sun Protection' },
    { value: 'oily-skin', label: 'Oily Skin' },
    { value: 'congestion', label: 'Congestion' },
];
