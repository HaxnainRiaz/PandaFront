import { useState, useEffect } from 'react';
import { useReviews } from '@/context/ReviewsContext';
import { Button, Input, Dropdown } from '@/components/ui';
import { useStoreAuth } from '@/context/StoreAuthContext';
import { useToast } from '@/context/ToastContext';
import {
    Star, MessageSquare, Plus, CheckCircle, Image as ImageIcon,
    User, UserCheck, Clock, Sparkles, X, User as UserIcon,
} from 'lucide-react';
import { resolveImageUrl } from '@/lib/utils';

export default function ProductReviews({ productId }) {
    const { getReviews, addReview, fetchReviews, isClient } = useReviews();
    const { user } = useStoreAuth();
    const { addToast } = useToast();
    const reviews = getReviews(productId);

    const [showForm, setShowForm] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);
    const [newReview, setNewReview] = useState({
        name: '',
        rating: 0,
        comment: '',
        resultsTime: '1 week',
        skinType: 'Combination',
        recommend: 'Yes',
        image: null,
    });
    const [displayLimit, setDisplayLimit] = useState(5);

    useEffect(() => {
        if (productId) fetchReviews(productId);
    }, [productId, fetchReviews]);

    useEffect(() => {
        if (!showForm) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, [showForm]);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const sortedReviews = [...reviews].sort((a, b) => {
        return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
    });
    const paginatedReviews = sortedReviews.slice(0, displayLimit);

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
        if (ratingCounts[r.rating] !== undefined) ratingCounts[r.rating]++;
    });

    const closeForm = () => setShowForm(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newReview.rating === 0) {
            addToast('Please select a star rating', 'error');
            return;
        }
        const dataToSubmit = { ...newReview, title: newReview.comment };
        if (user) dataToSubmit.name = user.name;

        const result = await addReview(productId, dataToSubmit);
        if (result.success) {
            setNewReview({
                name: '', rating: 0, comment: '',
                resultsTime: '1 week', skinType: 'Combination', recommend: 'Yes', image: null,
            });
            setShowForm(false);
            addToast('Review submitted. It will appear after moderation.', 'success');
        } else {
            addToast(result.message || 'Failed to submit review', 'error');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setNewReview((prev) => ({ ...prev, image: reader.result }));
        reader.readAsDataURL(file);
    };

    if (!isClient) return null;

    return (
        <section className="py-10 md:py-14 border-t border-[#e5e7eb] mt-12 scroll-mt-24" id="reviews">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div className="space-y-2">
                    <span className="section-badge mb-2 inline-flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Reviews
                    </span>
                    <h2
                        className="text-2xl md:text-3xl font-bold text-[#1a1a2e]"
                        style={{ fontFamily: 'var(--font-plus-jakarta, Inter, sans-serif)' }}
                    >
                        Customer Reviews
                    </h2>
                </div>
                {!showForm && (
                    <Button
                        onClick={() => setShowForm(true)}
                        className="rounded-[10px] px-5 py-2.5 h-auto text-sm font-semibold w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        Write a Review
                    </Button>
                )}
            </div>

            {/* Rating summary */}
            <div className="bg-white rounded-[16px] border border-[#e5e7eb] overflow-hidden shadow-sm mb-8">
                <div className="grid md:grid-cols-12">
                    <div className="md:col-span-4 p-6 md:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#e5e7eb] bg-[#f8f9fa]/50">
                        <div className="text-5xl md:text-6xl font-bold text-[#1a1a2e] mb-2">{averageRating}</div>
                        <div className="flex gap-0.5 text-amber-400 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 md:w-5 md:h-5 ${i < Math.round(averageRating) ? 'fill-amber-400' : 'text-gray-200'}`} />
                            ))}
                        </div>
                        <p className="text-xs text-gray-500">
                            Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                        </p>
                    </div>
                    <div className="md:col-span-8 p-6 md:p-8 space-y-2.5 flex flex-col justify-center">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center gap-3">
                                <span className="text-xs font-medium text-gray-600 w-8 flex items-center gap-0.5">
                                    {star} <Star className="w-3 h-3 fill-current" />
                                </span>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-400 rounded-full transition-all"
                                        style={{ width: `${reviews.length ? (ratingCounts[star] / reviews.length) * 100 : 0}%` }}
                                    />
                                </div>
                                <span className="text-xs text-gray-400 w-6 tabular-nums">{ratingCounts[star]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Review form modal */}
            {showForm && (
                <div
                    className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="review-modal-title"
                >
                    <div
                        className="absolute inset-0 bg-[#1a1a2e]/55 backdrop-blur-[2px]"
                        onClick={closeForm}
                    />
                    <div className="relative z-10 w-full sm:max-w-md md:max-w-lg bg-white sm:rounded-[16px] rounded-t-[16px] border border-[#e5e7eb] shadow-2xl flex flex-col max-h-[min(92dvh,680px)] sm:max-h-[min(88vh,680px)]">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 px-4 py-3.5 sm:px-5 sm:py-4 border-b border-[#e5e7eb] shrink-0">
                            <div className="min-w-0 pr-2">
                                <h3 id="review-modal-title" className="text-base sm:text-lg font-bold text-[#1a1a2e]">
                                    Write a Review
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">Share your experience with this product</p>
                            </div>
                            <button
                                type="button"
                                onClick={closeForm}
                                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 shrink-0"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                            <div className="overflow-y-auto overscroll-contain flex-1 px-4 py-4 sm:px-5 sm:py-4 space-y-4">
                                <div className="p-3 sm:p-4 bg-[#f8f9fa] rounded-[12px] border border-[#e5e7eb]">
                                    <p className="text-xs font-medium text-gray-500 text-center mb-2">Your rating</p>
                                    <div className="flex justify-center gap-1.5 sm:gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setNewReview((prev) => ({ ...prev, rating: star }))}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="p-1 transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                                                        (hoverRating || newReview.rating) >= star
                                                            ? 'text-amber-400 fill-amber-400'
                                                            : 'text-gray-200'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {!user && (
                                    <Input
                                        label="Your name"
                                        required
                                        value={newReview.name}
                                        onChange={(e) => setNewReview((prev) => ({ ...prev, name: e.target.value }))}
                                        placeholder="Full name"
                                        icon={UserIcon}
                                    />
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">Your review</label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="What did you like or dislike?"
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                                        className="w-full px-3 py-2.5 text-sm border border-[#e5e7eb] rounded-[10px] resize-none focus:outline-none focus:ring-2 focus:ring-[#e63946]/20 focus:border-[#e63946]"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Dropdown
                                        label="Delivery experience"
                                        icon={Clock}
                                        value={newReview.resultsTime}
                                        onChange={(e) => setNewReview((prev) => ({ ...prev, resultsTime: e.target.value }))}
                                        options={[
                                            { value: '1 week', label: 'Within 1 week' },
                                            { value: '2 weeks', label: 'Within 2 weeks' },
                                            { value: '3–4 weeks', label: '3–4 weeks' },
                                            { value: 'More than a month', label: '1 month+' },
                                        ]}
                                    />
                                    <Dropdown
                                        label="Product type"
                                        icon={Sparkles}
                                        value={newReview.skinType}
                                        onChange={(e) => setNewReview((prev) => ({ ...prev, skinType: e.target.value }))}
                                        options={[
                                            { value: 'Fashion', label: 'Fashion' },
                                            { value: 'Beauty', label: 'Beauty' },
                                            { value: 'Electronics', label: 'Electronics' },
                                            { value: 'Home', label: 'Home & Living' },
                                        ]}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">Photo (optional)</label>
                                    <div className="flex gap-3">
                                        {newReview.image ? (
                                            <div className="relative w-16 h-16 rounded-[10px] overflow-hidden border border-[#e5e7eb] group">
                                                <img src={newReview.image} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setNewReview((prev) => ({ ...prev, image: null }))}
                                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4 text-white" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="w-16 h-16 rounded-[10px] border-2 border-dashed border-[#e5e7eb] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                                                <ImageIcon className="w-5 h-5 text-gray-400" />
                                                <span className="text-[9px] text-gray-400 mt-0.5">Upload</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0 px-4 py-3 sm:px-5 sm:py-4 border-t border-[#e5e7eb] flex gap-2 sm:gap-3 bg-white pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                                <Button type="button" variant="outline" onClick={closeForm} className="flex-1 h-10 text-sm">
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1 h-10 text-sm font-semibold">
                                    Submit Review
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Review list */}
            <div className="space-y-3">
                {reviews.length === 0 ? (
                    <div className="text-center py-10 bg-[#f8f9fa] rounded-[16px] border border-dashed border-[#e5e7eb]">
                        <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this product.</p>
                    </div>
                ) : (
                    paginatedReviews.map((review) => (
                        <div
                            key={review._id || review.id}
                            className="bg-white py-4 px-4 sm:px-6 rounded-[16px] border border-[#e5e7eb] shadow-sm"
                        >
                            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                                <div className="lg:w-48 shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-[#f8f9fa] flex items-center justify-center">
                                            <User className="w-4 h-4 text-gray-500" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-[#1a1a2e]">{review.name || 'Anonymous'}</p>
                                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                <UserCheck className="w-3 h-3" /> Verified buyer
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {new Date(review.createdAt || review.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>

                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                                            ))}
                                        </div>
                                        {review.recommend === 'Yes' && (
                                            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> Recommended
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment || review.title}</p>

                                    {review.images?.length > 0 && (
                                        <div className="flex gap-2 pt-1 overflow-x-auto">
                                            {review.images.map((img, idx) => (
                                                <div key={idx} className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-[10px] overflow-hidden border border-[#e5e7eb] shrink-0">
                                                    <img src={resolveImageUrl(img)} alt="Review" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {review.adminReply && (
                                        <div className="mt-3 p-3 bg-[#f8f9fa] rounded-[10px] border border-[#e5e7eb]">
                                            <p className="text-xs font-semibold text-[#e63946] mb-1">Store response</p>
                                            <p className="text-sm text-gray-600">{review.adminReply}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {reviews.length > displayLimit && (
                <div className="mt-8 flex justify-center">
                    <Button variant="outline" onClick={() => setDisplayLimit((prev) => prev + 5)} className="text-sm">
                        Load More Reviews
                    </Button>
                </div>
            )}
        </section>
    );
}
