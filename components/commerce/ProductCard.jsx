'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, calculateDiscount, resolveImageUrl, stripHtml, cleanRichText } from '@/lib/utils';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import WishlistButton from './WishlistButton';
import { trackMetaEvent } from '@/lib/metaPixel';
import { Flame } from 'lucide-react';

export default function ProductCard({ product }) {
    const [imageError, setImageError] = useState(false);
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const [added, setAdded] = useState(false);

    const discount = calculateDiscount(product.price, product.salePrice);
    const displayPrice = product.salePrice || product.price;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAdding(true);
        addToCart(product, 1);
        trackMetaEvent('AddToCart', {
            content_ids: [product._id],
            content_name: product.title,
            content_type: 'product',
            value: product.salePrice || product.price,
            currency: 'PKR',
            contents: [{ id: product._id, quantity: 1 }],
        });
        setTimeout(() => {
            setIsAdding(false);
            setAdded(true);
            setTimeout(() => setAdded(false), 1800);
        }, 700);
    };

    const imageUrl = resolveImageUrl(product.images?.[0]);

    return (
        <div className="group relative bg-white rounded-[14px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <Link href={`/product/${product.slug}`} className="block">
                {/* Image Container */}
                <div className="relative overflow-hidden bg-gray-50 aspect-[4/3]">
                    <Image
                        src={imageError
                            ? `https://placehold.co/600x450/f3f4f6/9ca3af?text=${encodeURIComponent(product.title)}`
                            : imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-[1.06] transition-transform duration-500 ease-out"
                        onError={() => setImageError(true)}
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Badges top-left */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        {product.salePrice && (
                            <Badge variant="sale">-{discount}%</Badge>
                        )}
                        {product.isBestSeller && !product.salePrice && (
                            <Badge variant="primary">
                                <span className="inline-flex items-center gap-1">
                                    <Flame className="w-3 h-3" />
                                    Hot
                                </span>
                            </Badge>
                        )}
                        {product.isNew && (
                            <Badge variant="new">NEW</Badge>
                        )}
                    </div>

                    {/* Wishlist top-right */}
                    <div className="absolute top-3 right-3 z-10">
                        <WishlistButton productId={product._id} />
                    </div>

                    {/* Low stock warning */}
                    {product.stock > 0 && product.stock < 10 && (
                        <div className="absolute bottom-3 left-3 z-10">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#f59e0b] text-white text-[10px] font-bold rounded-[6px]">
                                ⚡ Only {product.stock} left
                            </span>
                        </div>
                    )}

                    {/* Out of stock overlay */}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                            <span className="px-4 py-2 bg-white/90 text-[#1a1a2e] text-xs font-bold rounded-[8px] uppercase tracking-wide">
                                Out of Stock
                            </span>
                        </div>
                    )}

                    {/* Hover Quick-Add Overlay — desktop only */}
                    <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden md:flex justify-center">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="w-full max-w-[200px] py-2.5 rounded-[10px] text-xs font-bold text-white uppercase tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            style={{ background: added ? '#10b981' : 'linear-gradient(135deg,#e63946,#c1121f)' }}
                        >
                            {added ? '✓ Added to Cart' : isAdding ? 'Adding...' : '+ Add to Cart'}
                        </button>
                    </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                    {/* Category pill */}
                    {product.category && (
                        <p className="text-[10px] font-semibold text-[#e63946] uppercase tracking-widest mb-1 truncate">
                            {typeof product.category === 'object' ? product.category.title : product.category}
                        </p>
                    )}

                    {/* Title */}
                    <h3 className="text-[14px] font-bold text-[#1a1a2e] mb-1.5 line-clamp-2 leading-snug group-hover:text-[#e63946] transition-colors">
                        {cleanRichText(product.title)}
                    </h3>

                    {/* Description */}
                    <p className="text-[12px] text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                        {stripHtml(product.description)}
                    </p>

                    {/* Rating */}
                    {product.rating > 0 && (
                        <div className="flex items-center gap-1.5 mb-3">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-[#f59e0b]' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-[11px] text-gray-400 font-medium">{product.rating} ({product.totalReviews || 0})</span>
                        </div>
                    )}

                    {/* Price + Mobile Add */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-baseline gap-2">
                            <span className="text-[17px] font-extrabold text-[#1a1a2e]">
                                {formatPrice(displayPrice)}
                            </span>
                            {product.salePrice && (
                                <span className="text-[12px] text-gray-400 line-through font-medium">
                                    {formatPrice(product.price)}
                                </span>
                            )}
                        </div>

                        {/* Mobile quick add */}
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="md:hidden w-9 h-9 rounded-[10px] flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex-shrink-0"
                            style={{ background: added ? '#10b981' : '#e63946' }}
                            aria-label="Add to cart"
                        >
                            {added ? (
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
}
