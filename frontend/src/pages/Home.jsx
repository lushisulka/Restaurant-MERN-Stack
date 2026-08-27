import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import './Home.css'

const Home = () => {
    const { t } = useLanguage()
    const { addToCart, openCart } = useCart()
    const navigate = useNavigate()
    const [featuredDishes, setFeaturedDishes] = useState([])
    const [loadingDishes, setLoadingDishes] = useState(true)

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await api.get('/menu')
                // Take 3 top items as featured
                setFeaturedDishes(res.data.slice(0, 3))
            } catch (err) {
                console.error('Error loading featured menu:', err)
            } finally {
                setLoadingDishes(false)
            }
        }
        fetchFeatured()
    }, [])

    const handleQuickAdd = (dish) => {
        addToCart(dish, 1)
        toast.success(`Added ${dish.name} to cart!`)
    }

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero" id="hero">
                {/* Video Background */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="hero-video"
                    poster="/assets/hero.png"
                >
                    <source src="/videos/hero.mp4" type="video/mp4" />
                </video>

                <div className="hero-overlay" />
                <div className="hero-gradient" />

                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="pulse-dot" />
                        Fresh & Authentic Italian Cuisine
                    </div>

                    <h1 className="hero-title">
                        {t.hero?.title?.split(' ').slice(0, 2).join(' ') || 'Welcome to'}
                        <span>
                            {t.hero?.title?.split(' ').slice(2).join(' ') || 'Pastarella'}
                        </span>
                    </h1>

                    <p className="hero-subtitle">
                        {t.hero?.subtitle || 'Are you ready to eat? We are here to serve you the best food in town!'}
                    </p>

                    <div className="hero-buttons">
                        <Link to="/menu" className="btn primary">
                            {t.hero?.button || 'View Menu'}
                        </Link>
                        <button onClick={openCart} className="btn secondary">
                            {t.nav?.cart || 'View Cart'} 🛒
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats">
                <div className="stats-container">
                    {[
                        { value: '500+', label: 'Happy Customers' },
                        { value: '50+', label: 'Menu Items' },
                        { value: '4.9', label: 'Average Rating' },
                        { value: '30min', label: 'Fast Delivery' },
                    ].map((stat, i) => (
                        <div key={i} className="stat">
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Dishes Section */}
            <section className="featured-section max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-14">
                    <span className="text-sm font-medium tracking-widest text-[#A67B5B] uppercase block mb-2">
                        Chef's Selection
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif text-[#f0e8df]">
                        Signature Delicacies
                    </h2>
                </div>

                {loadingDishes ? (
                    <div className="text-center py-10 text-gray-400">Loading specialties...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {(featuredDishes.length > 0 ? featuredDishes : [
                            {
                                _id: 'f1',
                                name: 'Spaghetti alla Carbonara',
                                price: 12.50,
                                category: 'Pasta',
                                description: 'Traditional Roman carbonara with crispy guanciale and Pecorino Romano.',
                                image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600'
                            },
                            {
                                _id: 'f2',
                                name: 'Pizza Margherita D.O.P.',
                                price: 9.50,
                                category: 'Pizza',
                                description: 'Wood oven baked with San Marzano tomatoes and Fior di Latte.',
                                image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600'
                            },
                            {
                                _id: 'f3',
                                name: 'Traditional Tiramisù',
                                price: 6.50,
                                category: 'Dessert',
                                description: 'Savoiardi ladyfingers soaked in espresso with whipped mascarpone.',
                                image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600'
                            }
                        ]).map((dish) => (
                            <div key={dish._id} className="dish-featured-card">
                                <div className="dish-img-wrapper">
                                    <img src={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'} alt={dish.name} />
                                    <span className="dish-category-tag">{dish.category}</span>
                                </div>
                                <div className="dish-card-info">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-serif text-[#f0e8df]">{dish.name}</h3>
                                        <span className="text-lg font-bold text-[#A67B5B]">€{dish.price?.toFixed(2)}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-6 flex-1">{dish.description}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleQuickAdd(dish)}
                                            className="btn primary flex-1 text-center text-xs py-3"
                                        >
                                            {t.menu?.addToCart || 'Add to Cart'}
                                        </button>
                                        <button
                                            onClick={() => navigate('/menu')}
                                            className="btn secondary text-xs py-3 px-4"
                                            title="View in Menu"
                                        >
                                            →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link to="/menu" className="btn secondary">
                        View Full Menu (50+ Items) →
                    </Link>
                </div>
            </section>

            {/* Experience & Quality Banner */}
            <section className="quality-banner bg-[#140e0b] border-y border-[#A67B5B]/15 py-16 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6">
                        <div className="text-4xl mb-4">🌾</div>
                        <h4 className="text-xl font-serif text-[#f0e8df] mb-2">100% Italian Ingredients</h4>
                        <p className="text-sm text-gray-400">Imported organic semolina, San Marzano tomatoes, and extra virgin olive oil from Tuscany.</p>
                    </div>
                    <div className="p-6">
                        <div className="text-4xl mb-4">🔥</div>
                        <h4 className="text-xl font-serif text-[#f0e8df] mb-2">Artisanal Wood Oven</h4>
                        <p className="text-sm text-gray-400">Pizzas fermented for 48 hours and fired at 450°C for the ultimate airy, crispy crust.</p>
                    </div>
                    <div className="p-6">
                        <div className="text-4xl mb-4">⚡</div>
                        <h4 className="text-xl font-serif text-[#f0e8df] mb-2">Express Warm Delivery</h4>
                        <p className="text-sm text-gray-400">Specially insulated packaging ensures your meal arrives fresh and piping hot.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="cta-box">
                    <h2>Ready to Experience Pastarella?</h2>
                    <p>
                        Explore our full menu, customize your order, and get fresh food delivered to your door in 30 minutes.
                    </p>
                    <Link to="/menu" className="btn primary">
                        {t.hero?.button || 'Order Online Now'} →
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default Home