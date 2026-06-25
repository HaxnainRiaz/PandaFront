'use client';

import { useState, useEffect, Suspense } from 'react';
import PageHero from '@/components/ui/PageHero';
import { Container, Dropdown, ProductSkeleton } from '@/components/ui';
import ProductCard from '@/components/commerce/ProductCard';
import { sortProducts, filterProducts } from '@/lib/products';
import { useSearchParams } from 'next/navigation';
import { useCore } from '@/context/CoreContext';

function ShopContent() {
    const { products: allProducts, categories: apiCategories, loading } = useCore();
    const searchParams = useSearchParams();
    const [products, setProducts] = useState([]);
    const [sortBy, setSortBy] = useState('featured');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { value: 'all', label: 'All Products' },
        ...apiCategories.map(cat => ({ value: cat._id, label: cat.title }))
    ];

    useEffect(() => {
        if (!loading) setProducts(allProducts);
    }, [allProducts, loading]);

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) setSelectedCategory(categoryParam);
    }, [searchParams]);

    useEffect(() => {
        let filtered = filterProducts([...allProducts], { category: selectedCategory });
        filtered = sortProducts(filtered, sortBy);
        setProducts(filtered);
    }, [sortBy, selectedCategory, allProducts]);

    return (
        <>
            <PageHero
                badge="Shop"
                title="All Products"
                subtitle="Discover our complete collection of fashion, beauty, jewellery, bags, and lifestyle essentials."
            />

            <Container className="py-10 md:py-12">
                <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full md:w-auto">
                        <Dropdown
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            options={categories}
                            className="min-w-[200px]"
                        />
                    </div>
                    <Dropdown
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        options={[
                            { value: 'featured', label: 'Featured' },
                            { value: 'price-asc', label: 'Price: Low to High' },
                            { value: 'price-desc', label: 'Price: High to Low' },
                            { value: 'rating', label: 'Highest Rated' },
                            { value: 'newest', label: 'Newest' },
                        ]}
                        className="min-w-[200px]"
                    />
                </div>

                <p className="text-gray-500 text-sm mb-6">
                    Showing {products.length} {products.length === 1 ? 'product' : 'products'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {loading
                        ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
                        : products.map((product) => (
                            <ProductCard key={product.id || product._id} product={product} />
                        ))
                    }
                </div>

                {products.length === 0 && !loading && (
                    <div className="text-center py-16">
                        <p className="text-xl text-gray-500 mb-4">No products found</p>
                        <button
                            onClick={() => { setSelectedCategory('all'); setSortBy('featured'); }}
                            className="text-[#e63946] font-semibold hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </Container>
        </>
    );
}

export default function ShopPage() {
    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-[#e63946] font-semibold">Loading shop...</div>
                </div>
            }>
                <ShopContent />
            </Suspense>
        </div>
    );
}
