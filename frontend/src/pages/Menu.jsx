import { useEffect, useState, useMemo } from 'react'
import api from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import toast from 'react-hot-toast'

export default function Menu() {
    const [menu, setMenu] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('default')
    const [quantities, setQuantities] = useState({})

    // Review Modal State
    const [selectedDishForReviews, setSelectedDishForReviews] = useState(null)
    const [dishReviews, setDishReviews] = useState([])
    const [loadingReviews, setLoadingReviews] = useState(false)
    const [reviewRating, setReviewRating] = useState(5)
    const [reviewComment, setReviewComment] = useState('')
    const [submittingReview, setSubmittingReview] = useState(false)

    const { addToCart } = useCart()
    const { user } = useAuth()
    const { t } = useLanguage()

    const categories = [
        { key: 'All', label: t.menu?.all || 'All' },
        { key: 'Pasta', label: t.menu?.pasta || 'Pasta' },
        { key: 'Pizza', label: t.menu?.pizza || 'Pizza' },
        { key: 'Salad', label: t.menu?.salad || 'Salad' },
        { key: 'Burger', label: t.menu?.burger || 'Burger' },
        { key: 'Sushi', label: t.menu?.sushi || 'Sushi' },
        { key: 'Waffle', label: t.menu?.waffle || 'Waffle' },
        { key: 'Other', label: t.menu?.other || 'Dessert & Other' },
    ]

    const fetchMenu = async () => {
        setLoading(true)
        try {
            const res = await api.get('/menu')
            setMenu(res.data)
        } catch (err) {
            toast.error('Failed to load menu items')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMenu()
    }, [])

    const handleQuantityChange = (id, delta) => {
        setQuantities(prev => {
            const current = prev[id] || 1
            const next = Math.max(1, current + delta)
            return { ...prev, [id]: next }
        })
    }

    const handleAddToCart = (dish) => {
        const qty = quantities[dish._id] || 1
        addToCart(dish, qty)
        toast.success(`Added ${qty}x ${dish.name} to cart! 🍽️`)
    }

    // Filter & sort logic
    const filteredDishes = useMemo(() => {
        return menu.filter(item => {
            const matchesCategory = activeCategory === 'All' ||
                item.category.toLowerCase() === activeCategory.toLowerCase()

            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))

            return matchesCategory && matchesSearch
        }).sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price
            if (sortBy === 'price-high') return b.price - a.price
            if (sortBy === 'name') return a.name.localeCompare(b.name)
            return 0
        })
    }, [menu, activeCategory, searchQuery, sortBy])

    // Open Reviews Modal
    const openReviewsModal = async (dish) => {
        setSelectedDishForReviews(dish)
        setLoadingReviews(true)
        try {
            const res = await api.get(`/reviews/${dish._id}`)
            setDishReviews(res.data)
        } catch {
            toast.error('Failed to load dish reviews')
        } finally {
            setLoadingReviews(false)
        }
    }

    const handleAddReview = async (e) => {
        e.preventDefault()
        if (!user) {
            toast.error('Please login to leave a review')
            return
        }

        if (!reviewComment.trim()) {
            toast.error('Please write a comment for your review')
            return
        }

        setSubmittingReview(true)
        try {
            const res = await api.post('/reviews', {
                menuItem: selectedDishForReviews._id,
                rating: reviewRating,
                comment: reviewComment.trim()
            })
            setDishReviews(prev => [res.data, ...prev])
            setReviewComment('')
            setReviewRating(5)
            toast.success('Thank you for your review! ⭐')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit review')
        } finally {
            setSubmittingReview(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0e0a08] text-[#e8ddd5] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Title */}
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <span className="text-xs font-semibold tracking-widest text-[#A67B5B] uppercase block mb-2">
                        Authentic Italian Specialties
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif text-[#f0e8df] tracking-tight mb-4">
                        {t.menu?.title || 'Our Menu'}
                    </h1>
                    <p className="text-sm text-gray-400">
                        Crafted daily using traditional recipes, fresh organic produce, and imported Italian ingredients.
                    </p>
                </div>

                {/* Filter and Search Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-[#140e0b] p-4 rounded-xl border border-[#A67B5B]/15">
                    {/* Category Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                        {categories.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-all ${
                                    activeCategory === cat.key
                                        ? 'bg-[#A67B5B] text-[#0e0a08] font-semibold shadow-md'
                                        : 'bg-[#1b1410] text-gray-400 hover:text-white border border-[#A67B5B]/10 hover:border-[#A67B5B]/30'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Search and Sort */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-60">
                            <input
                                type="text"
                                placeholder="Search dishes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#1b1410] text-sm text-white px-3 py-2 pl-8 rounded-lg border border-[#A67B5B]/20 focus:outline-none focus:border-[#A67B5B]"
                            />
                            <span className="absolute left-2.5 top-2.5 text-xs text-gray-500">🔍</span>
                        </div>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-[#1b1410] text-xs text-gray-300 px-3 py-2.5 rounded-lg border border-[#A67B5B]/20 focus:outline-none focus:border-[#A67B5B]"
                        >
                            <option value="default">Sort: Default</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name: A - Z</option>
                        </select>
                    </div>
                </div>

                {/* Dish Grid */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">
                        <div className="inline-block animate-spin text-3xl mb-3">🍝</div>
                        <p>{t.common?.loading || 'Loading our menu...'}</p>
                    </div>
                ) : filteredDishes.length === 0 ? (
                    <div className="text-center py-20 bg-[#140e0b] rounded-2xl border border-[#A67B5B]/10 p-8">
                        <span className="text-4xl block mb-3">🍽️</span>
                        <h3 className="text-lg font-serif text-white mb-1">No Dishes Found</h3>
                        <p className="text-sm text-gray-400">Try changing your search term or category filter.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDishes.map((dish) => {
                            const qty = quantities[dish._id] || 1

                            return (
                                <div
                                    key={dish._id}
                                    className="bg-[#140e0b] border border-[#A67B5B]/15 rounded-xl overflow-hidden flex flex-col justify-between hover:border-[#A67B5B]/40 hover:shadow-xl transition-all duration-300 group"
                                >
                                    <div>
                                        {/* Image wrapper */}
                                        <div className="relative h-48 sm:h-52 overflow-hidden bg-black/40">
                                            <img
                                                src={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'}
                                                alt={dish.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <span className="absolute top-3 left-3 bg-[#0e0a08]/85 backdrop-blur-md text-[#A67B5B] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#A67B5B]/30">
                                                {dish.category}
                                            </span>
                                            {dish.isAvailable === false && (
                                                <span className="absolute top-3 right-3 bg-red-900/90 text-red-200 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-red-700">
                                                    {t.menu?.outOfStock || 'Out of Stock'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Content info */}
                                        <div className="p-5">
                                            <div className="flex justify-between items-start gap-2 mb-2">
                                                <h3 className="text-xl font-serif text-[#f0e8df] leading-snug">
                                                    {dish.name}
                                                </h3>
                                                <span className="text-lg font-bold text-[#A67B5B] whitespace-nowrap">
                                                    €{dish.price?.toFixed(2)}
                                                </span>
                                            </div>

                                            <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">
                                                {dish.description || 'Delicately prepared with top-quality ingredients and authentic spices.'}
                                            </p>

                                            {/* Reviews Trigger */}
                                            <button
                                                onClick={() => openReviewsModal(dish)}
                                                className="text-xs text-[#A67B5B] hover:text-[#c49070] flex items-center gap-1 transition"
                                            >
                                                ⭐ <span>{t.menu?.reviews || 'Reviews'} & Feedback</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="p-5 pt-0 border-t border-[#A67B5B]/10 flex items-center gap-3 mt-2">
                                        {/* Quantity Selector */}
                                        <div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-1">
                                            <button
                                                onClick={() => handleQuantityChange(dish._id, -1)}
                                                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center text-xs font-semibold text-white">
                                                {qty}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(dish._id, 1)}
                                                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Add to Cart Button */}
                                        <button
                                            onClick={() => handleAddToCart(dish)}
                                            disabled={dish.isAvailable === false}
                                            className="flex-1 bg-[#A67B5B] hover:bg-[#c49070] disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-[#0e0a08] font-semibold text-xs tracking-wider uppercase py-3 px-4 rounded-lg transition-all text-center"
                                        >
                                            {t.menu?.addToCart || 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Reviews Modal */}
            {selectedDishForReviews && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedDishForReviews(null)}
                >
                    <div
                        className="bg-[#140e0b] border border-[#A67B5B]/30 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-5 border-b border-[#A67B5B]/15 flex justify-between items-center bg-[#1a120d]">
                            <div>
                                <h3 className="text-xl font-serif text-[#f0e8df]">{selectedDishForReviews.name}</h3>
                                <span className="text-xs text-[#A67B5B]">Guest Reviews & Ratings</span>
                            </div>
                            <button
                                onClick={() => setSelectedDishForReviews(null)}
                                className="text-gray-400 hover:text-white text-lg p-1"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body: List of Reviews */}
                        <div className="p-5 overflow-y-auto flex-1 space-y-4">
                            {loadingReviews ? (
                                <div className="text-center py-6 text-gray-400 text-sm">Loading reviews...</div>
                            ) : dishReviews.length === 0 ? (
                                <div className="text-center py-6 text-gray-400 text-sm">
                                    No reviews yet. Be the first to leave a review!
                                </div>
                            ) : (
                                dishReviews.map((rev) => (
                                    <div key={rev._id} className="bg-black/30 p-3.5 rounded-lg border border-white/5">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-semibold text-sm text-white">
                                                {rev.user?.name || 'Guest Gourmet'}
                                            </span>
                                            <div className="text-amber-400 text-xs">
                                                {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-300">{rev.comment}</p>
                                    </div>
                                ))
                            )}

                            {/* Add Review Form */}
                            <form onSubmit={handleAddReview} className="mt-4 pt-4 border-t border-[#A67B5B]/20">
                                <h4 className="text-sm font-semibold text-[#f0e8df] mb-2">
                                    {t.menu?.writeReview || 'Write a Review'}
                                </h4>

                                <div className="mb-3">
                                    <label className="text-xs text-gray-400 block mb-1">Your Rating</label>
                                    <select
                                        value={reviewRating}
                                        onChange={(e) => setReviewRating(Number(e.target.value))}
                                        className="bg-[#1b1410] border border-[#A67B5B]/30 text-white text-xs rounded p-2 w-full focus:outline-none focus:border-[#A67B5B]"
                                    >
                                        <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                                        <option value={4}>⭐⭐⭐⭐ (4 - Great)</option>
                                        <option value={3}>⭐⭐⭐ (3 - Good)</option>
                                        <option value={2}>⭐⭐ (2 - Fair)</option>
                                        <option value={1}>⭐ (1 - Needs Improvement)</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="text-xs text-gray-400 block mb-1">Comment</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Share your taste experience with this dish..."
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        className="w-full bg-[#1b1410] border border-[#A67B5B]/30 text-white text-xs rounded p-2.5 focus:outline-none focus:border-[#A67B5B]"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="w-full bg-[#A67B5B] hover:bg-[#c49070] text-[#0e0a08] font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg transition"
                                >
                                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}