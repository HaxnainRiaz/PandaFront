'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Container,
  Button,
  Badge,
  ProductDetailSkeleton,
} from '@/components/ui';
import {
  ChevronRight,
  Star,
  ShoppingBag,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  CreditCard,
  Package,
  RotateCcw,
  Flame,
  Tag,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { formatPrice, calculateDiscount, resolveImageUrl, stripHtml } from '@/lib/utils';
import RichTextRenderer from '@/components/commerce/RichTextRenderer';
import { useCart } from '@/hooks/useCart';
import WishlistButton from '@/components/commerce/WishlistButton';
import ProductCard from '@/components/commerce/ProductCard';
import ProductReviews from '@/components/commerce/ProductReviews';
import { useCore } from '@/context/CoreContext';
import { useToast } from '@/context/ToastContext';
import { trackMetaEvent } from '@/lib/metaPixel';

import { getApiUrl } from '@/lib/apiConfig';

function getCategoryIds(product) {
  if (!product?.category) return [];
  const cats = Array.isArray(product.category) ? product.category : [product.category];
  return cats.map((c) => (typeof c === 'object' ? c._id : c)).filter(Boolean);
}

function getCategoryLabel(product) {
  const cats = Array.isArray(product?.category) ? product.category : product?.category ? [product.category] : [];
  const first = cats[0];
  if (!first) return null;
  return typeof first === 'object' ? first.title : null;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;

  const { products: managedProducts = [], coupons = [] } = useCore();
  const { addToCart, addBundleToCart } = useCart();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [hasFiredView, setHasFiredView] = useState(false);
  const managedProductsRef = useRef(managedProducts);

  useEffect(() => {
    setImageError(false);
  }, [product, selectedImage]);

  useEffect(() => {
    managedProductsRef.current = managedProducts;
  }, [managedProducts]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadProduct() {
      setLoading(true);
      try {
        const res = await fetch(`${getApiUrl()}/products/slug/${slug}`, { signal: controller.signal });
        const data = await res.json();
        if (!cancelled && data.success) {
          setProduct(data.data);
          setLoading(false);
          return;
        }
      } catch (_) { /* fallback below */ }

      if (!cancelled) {
        const fallback = managedProductsRef.current.find((p) => p.slug === slug);
        setProduct(fallback || null);
        setLoading(false);
      }
    }

    loadProduct();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [slug]);

  const productImages = useMemo(
    () => (Array.isArray(product?.images) && product.images.length > 0 ? product.images : []),
    [product]
  );

  const fallbackImage = `https://placehold.co/800x800/f3f4f6/9ca3af?text=${encodeURIComponent(product?.title || 'Product')}`;
  const mainImage = imageError || !productImages[selectedImage]
    ? fallbackImage
    : resolveImageUrl(productImages[selectedImage]);

  useEffect(() => {
    if (!product?._id || hasFiredView) return;
    trackMetaEvent('ViewContent', {
      content_ids: [product._id],
      content_name: product.title,
      content_type: 'product',
      value: product.salePrice || product.price,
      currency: 'PKR',
    }, `vc_${product._id}_${Date.now()}`);
    setHasFiredView(true);
  }, [product, hasFiredView]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const ids = getCategoryIds(product);
    return managedProducts
      .filter((p) => {
        if (p._id === product._id) return false;
        const pIds = getCategoryIds(p);
        return ids.some((id) => pIds.includes(id));
      })
      .slice(0, 4);
  }, [product, managedProducts]);

  const relevantBundles = useMemo(() => {
    if (!product) return [];
    return (coupons || [])
      .filter(
        (c) =>
          c.isActive &&
          ((c.discountType === 'bundle' &&
            c.bundleProducts?.some((bp) => bp.product?._id === product._id)) ||
            (c.discountType === 'buy_x_get_y' &&
              (!c.buyXGetY?.buyProducts?.length ||
                c.buyXGetY?.buyProducts?.includes(product._id))) ||
            (c.discountType === 'quantity_discount' &&
              (!c.quantityDiscount?.products?.length ||
                c.quantityDiscount?.products?.includes(product._id))))
      );
  }, [coupons, product]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addToCart(product, quantity);
    addToast(`${product.title} added to cart`, 'success');
    trackMetaEvent('AddToCart', {
      content_ids: [product._id],
      content_name: product.title,
      content_type: 'product',
      value: (product.salePrice || product.price) * quantity,
      currency: 'PKR',
      contents: [{ id: product._id, quantity }],
    }, `atc_${product._id}_${Date.now()}`);
  }, [product, quantity, addToCart, addToast]);

  const handleBuyNow = useCallback(() => {
    handleAddToCart();
    router.push('/checkout');
  }, [handleAddToCart, router]);

  const handleBuyBundle = (bundle) => {
    if (bundle.discountType === 'bundle') {
      addBundleToCart(bundle.bundleProducts);
    } else if (bundle.discountType === 'buy_x_get_y') {
      addToCart(product, bundle.buyXGetY.buyQty);
    } else if (bundle.discountType === 'quantity_discount') {
      addToCart(product, bundle.quantityDiscount.minQty);
    }
    addToast(`Offer "${bundle.code}" added to cart`, 'success');
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa]">
        <Container className="py-8 md:py-12">
          <ProductDetailSkeleton />
        </Container>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <Container className="py-24 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-2">Product Not Found</h1>
          <p className="text-gray-500 mb-6">This item may have been removed or is no longer available.</p>
          <Link href="/shop">
            <Button>Browse Shop</Button>
          </Link>
        </Container>
      </div>
    );
  }

  const displayPrice = product.salePrice || product.price;
  const discount = calculateDiscount(product.price, product.salePrice);
  const categoryLabel = getCategoryLabel(product);
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock < 10;

  const trustItems = [
    { Icon: Truck, label: 'Fast delivery nationwide' },
    { Icon: RotateCcw, label: '7-day easy returns' },
    { Icon: ShieldCheck, label: 'Authentic products' },
    { Icon: CreditCard, label: 'Cash on delivery' },
  ];

  const detailTabs = [
    { id: 'description', label: 'Description' },
    ...(product.usage ? [{ id: 'usage', label: 'Details' }] : []),
    ...(product.ingredients?.length ? [{ id: 'features', label: 'Features' }] : []),
  ];

  const purchaseBlock = (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center border border-[#e5e7eb] rounded-[12px] bg-white overflow-hidden shrink-0">
        <button
          type="button"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-11 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-10 text-center font-semibold text-[#1a1a2e] tabular-nums">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
          disabled={!inStock || quantity >= product.stock}
          className="w-11 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-40"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={!inStock}
        className="flex-1 h-12 rounded-[12px] font-semibold text-sm gap-2"
        size="lg"
      >
        <ShoppingBag className="w-4 h-4" />
        Add to Cart
      </Button>

      <Button
        onClick={handleBuyNow}
        disabled={!inStock}
        className="flex-1 h-12 rounded-[12px] bg-[#1a1a2e] hover:bg-[#16213e] text-white border-0 font-semibold text-sm gap-2"
        size="lg"
      >
        <CreditCard className="w-4 h-4" />
        Buy Now
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24 md:pb-12">
      <Container className="py-5 md:py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#e63946] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <Link href="/shop" className="hover:text-[#e63946] transition-colors">Shop</Link>
          {categoryLabel && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              <span className="text-gray-400">{categoryLabel}</span>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <span className="text-[#1a1a2e] font-medium truncate max-w-[200px] sm:max-w-none">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mb-12 lg:mb-16">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-[16px] md:rounded-[20px] overflow-hidden border border-[#e5e7eb] shadow-sm">
              <Image
                src={mainImage}
                alt={product.title}
                fill
                className="object-cover"
                priority
                onError={() => setImageError(true)}
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.salePrice && (
                  <Badge variant="sale" className="px-3 py-1 text-xs font-bold shadow-sm">
                    -{discount}% OFF
                  </Badge>
                )}
                {product.isBestSeller && (
                  <Badge variant="primary" className="px-3 py-1 text-xs font-bold shadow-sm inline-flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    Bestseller
                  </Badge>
                )}
              </div>
            </div>

            {productImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1 snap-x">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => { setSelectedImage(index); setImageError(false); }}
                    className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-[10px] overflow-hidden border-2 transition-all snap-start ${
                      selectedImage === index
                        ? 'border-[#e63946] ring-2 ring-[#e63946]/20'
                        : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <Image
                      src={resolveImageUrl(image) || fallbackImage}
                      alt={`${product.title} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="space-y-2 min-w-0">
                {categoryLabel && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#e63946]">{categoryLabel}</p>
                )}
                <h1
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a2e] leading-tight"
                  style={{ fontFamily: 'var(--font-plus-jakarta, Inter, sans-serif)' }}
                >
                  {product.title}
                </h1>
              </div>
              <WishlistButton productId={product._id} />
            </div>

            {/* Rating */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {(product.rating || 0).toFixed(1)} · {product.totalReviews || 0} reviews
              </span>
              <a href="#reviews" className="text-sm font-medium text-[#e63946] hover:underline inline-flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                Read reviews
              </a>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[#e5e7eb]">
              <span className="text-3xl sm:text-4xl font-bold text-[#1a1a2e]">{formatPrice(displayPrice)}</span>
              {product.salePrice && (
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
              )}
              {product.salePrice && (
                <span className="text-sm font-semibold text-[#e63946] bg-[#e63946]/10 px-2 py-0.5 rounded-md">
                  Save {formatPrice(product.price - product.salePrice)}
                </span>
              )}
            </div>

            {/* Stock status */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-[10px] text-sm font-medium ${
                inStock ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                <CheckCircle2 className="w-4 h-4" />
                {inStock ? (lowStock ? `Only ${product.stock} left in stock` : 'In stock') : 'Out of stock'}
              </div>
              {inStock && (
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-[10px] text-sm font-medium bg-white border border-[#e5e7eb] text-gray-600">
                  <Truck className="w-4 h-4 text-[#e63946]" />
                  Delivered in 2–5 business days
                </div>
              )}
            </div>

            {/* Short description preview */}
            {product.description && (
              <p className="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-3">
                {stripHtml(product.description).slice(0, 220)}
                {stripHtml(product.description).length > 220 ? '...' : ''}
              </p>
            )}

            {/* Desktop purchase */}
            <div className="hidden md:block mb-8">
              {purchaseBlock}
            </div>

            {/* Trust row */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {trustItems.map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 p-3 rounded-[10px] bg-white border border-[#e5e7eb]">
                  <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#e63946]" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 leading-snug">{label}</span>
                </div>
              ))}
            </div>

            {/* Bundle offers */}
            {relevantBundles.length > 0 && (
              <div className="mb-8 space-y-3">
                <h3 className="text-sm font-bold text-[#1a1a2e] uppercase tracking-wide">Special Offers</h3>
                {relevantBundles.map((bundle) => (
                  <div
                    key={bundle._id}
                    className="p-4 rounded-[12px] border border-dashed border-[#f4a261]/40 bg-[#fff8f3] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-[#e5e7eb] flex items-center justify-center">
                        <Package className="w-5 h-5 text-[#e63946]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1a1a2e]">{bundle.code}</p>
                        <p className="text-xs text-gray-500">
                          {bundle.discountType === 'bundle'
                            ? 'Bundle deal with special pricing'
                            : bundle.discountType === 'buy_x_get_y'
                              ? `Buy ${bundle.buyXGetY.buyQty} Get ${bundle.buyXGetY.getQty} offer`
                              : `Buy ${bundle.quantityDiscount.minQty}+ for ${bundle.quantityDiscount.discountValue}% off`}
                        </p>
                      </div>
                    </div>
                    <Button onClick={() => handleBuyBundle(bundle)} variant="secondary" size="sm" className="shrink-0">
                      Get Offer
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            {Array.isArray(product.tags) && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-white border border-[#e5e7eb] px-2.5 py-1 rounded-full">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content tabs */}
        <div className="bg-white rounded-[16px] border border-[#e5e7eb] shadow-sm overflow-hidden mb-12 lg:mb-16">
          <div className="flex border-b border-[#e5e7eb] overflow-x-auto">
            {detailTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#e63946] text-[#e63946]'
                    : 'border-transparent text-gray-500 hover:text-[#1a1a2e]'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 border-transparent text-gray-500 hover:text-[#1a1a2e] ml-auto"
            >
              Reviews
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'description' && (
              <RichTextRenderer
                content={product.longDescription || product.description}
                className="prose-product text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl"
              />
            )}
            {activeTab === 'usage' && product.usage && (
              <RichTextRenderer content={product.usage} className="prose-product text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl" />
            )}
            {activeTab === 'features' && product.ingredients?.length > 0 && (
              <ul className="grid sm:grid-cols-2 gap-3 max-w-3xl">
                {Array.from(new Set(product.ingredients)).map((item, idx) => (
                  <li key={`${item}-${idx}`} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-[#e63946] mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <ProductReviews productId={product._id} />

        {relatedProducts.length > 0 && (
          <section className="mt-12 lg:mt-16 pt-10 border-t border-[#e5e7eb]">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="section-badge mb-2 inline-flex items-center gap-1.5">Related</span>
                <h2
                  className="text-2xl md:text-3xl font-bold text-[#1a1a2e]"
                  style={{ fontFamily: 'var(--font-plus-jakarta, Inter, sans-serif)' }}
                >
                  You May Also Like
                </h2>
              </div>
              <Link href="/shop" className="text-sm font-semibold text-[#e63946] hover:underline hidden sm:block">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </Container>

      {/* Mobile sticky purchase bar */}
      <div className="fixed bottom-[62px] md:bottom-0 left-0 right-0 z-30 md:hidden bg-white border-t border-[#e5e7eb] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-lg font-bold text-[#1a1a2e] leading-none">{formatPrice(displayPrice)}</p>
            {product.salePrice && (
              <p className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</p>
            )}
          </div>
          <div className="flex items-center border border-[#e5e7eb] rounded-[10px] overflow-hidden shrink-0">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-9 h-10 flex items-center justify-center text-gray-500"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
              disabled={!inStock || quantity >= product.stock}
              className="w-9 h-10 flex items-center justify-center text-gray-500 disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="flex-1 h-10 rounded-[10px] font-semibold text-sm gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
