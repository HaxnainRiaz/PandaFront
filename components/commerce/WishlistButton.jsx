'use client';

import { useRouter } from 'next/navigation';
import { useStoreAuth } from '@/context/StoreAuthContext';

export default function WishlistButton({ productId, className = '' }) {
    const { user, toggleWishlist } = useStoreAuth();
    const router = useRouter();

    // Check if product is in user's wishlist
    const isWishlisted = user?.wishlist?.includes(productId);

    const handleToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            router.push('/account/login');
            return;
        }

        await toggleWishlist(productId);
    };

    return (
        <button
            onClick={handleToggle}
            className={`p-2 bg-white rounded-full shadow-[0_4px_20px_rgba(11,47,38,0.08)] hover:shadow-[0_8px_30px_rgba(11,47,38,0.1)] transition-all ${className}`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <svg
                className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'fill-none text-[#1a1a2e]'}`}
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        </button>
    );
}
