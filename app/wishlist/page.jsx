'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import ProductCard from '@/components/commerce/ProductCard';
import { useStoreAuth } from '@/context/StoreAuthContext';
import { useCore } from '@/context/CoreContext';

export default function WishlistPage() {
    const { user, loading: authLoading } = useStoreAuth();
    const { products, loading: productsLoading } = useCore();
    const [wishlistProducts, setWishlistProducts] = useState([]);

    useEffect(() => {
        if (!authLoading && !productsLoading && user && products) {
            const savedIds = user.wishlist || [];
            const filtered = products.filter(p => savedIds.includes(p._id));
            setWishlistProducts(filtered);
        }
    }, [user, products, authLoading, productsLoading]);

    if (authLoading || productsLoading) {
        return <div className="py-24 text-center">Loading Wishlist...</div>;
    }

    if (!user) {
        return (
            <Container className="py-24 text-center">
                <h1 className="text-3xl font-heading font-bold text-[#1a1a2e] mb-4">Please log in to see your wishlist</h1>
                <Link href="/account/login">
                    <Button>Sign In</Button>
                </Link>
            </Container>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa]">
            <div className="bg-[#1a1a2e] text-white py-16">
                <Container>
                    <h1 className="text-4xl text-white md:text-5xl font-heading font-bold">My Wishlist</h1>
                </Container>
            </div>

            <Container className="py-12">
                {wishlistProducts.length === 0 ? (
                    <div className="text-center py-24">
                        <svg className="w-24 h-24 mx-auto text-[#6b7280]/30 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h2 className="text-2xl font-heading font-semibold text-[#1a1a2e] mb-4">
                            Your wishlist is empty
                        </h2>
                        <p className="text-[#6b7280] mb-8">
                            Save your favorite products for later
                        </p>
                        <Link href="/shop">
                            <Button size="lg">Discover Products</Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="text-[#6b7280] mb-6">
                            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {wishlistProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </>
                )}
            </Container>
        </div>
    );
}
