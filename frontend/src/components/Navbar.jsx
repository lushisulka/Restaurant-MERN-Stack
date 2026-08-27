import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import toast from 'react-hot-toast'
import './Navbar.css'

const Navbar = () => {
    const { user, logout } = useAuth()
    const { totalItems, openCart } = useCart()
    const { t, language, changeLanguage } = useLanguage()
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogout = () => {
        logout()
        toast.success('Logged out successfully')
        navigate('/')
    }

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                {/* Brand Logo */}
                <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
                    <img src="/images/logo.png" alt="Pastarella" className="logo-img" />
                    <span>
                        Pastarella
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="nav-links">
                    <NavLink to="/" end>{t.nav?.home || 'Home'}</NavLink>
                    <NavLink to="/menu">{t.nav?.menu || 'Menu'}</NavLink>
                    {user && (
                        <NavLink to="/orders">{t.nav?.orders || 'My Orders'}</NavLink>
                    )}
                    <NavLink to="/contact">{t.nav?.contact || 'Contact'}</NavLink>
                    {user?.role === 'admin' && (
                        <NavLink to="/admin/menu" className="admin-nav-link">
                            🛡️ Admin Panel
                        </NavLink>
                    )}
                </div>

                {/* Right Action Elements */}
                <div className="nav-actions">
                    {/* Language Switcher */}
                    <div className="lang-switch">
                        {[
                            { code: 'sq', label: 'Shqip' },
                            { code: 'en', label: 'English' },
                            { code: 'it', label: 'Italiano' },
                        ].map(lang => (
                            <div key={lang.code} className="lang-item">
                                <button
                                    onClick={() => changeLanguage(lang.code)}
                                    className={language === lang.code ? 'active' : ''}
                                    title={lang.label}
                                >
                                    {lang.code.toUpperCase()}
                                </button>
                                <span className="lang-tooltip">{lang.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Cart Trigger Button */}
                    <button
                        className="cart-nav-btn"
                        onClick={openCart}
                        aria-label="View Cart"
                    >
                        <span className="cart-icon">🛒</span>
                        {totalItems > 0 && (
                            <span className="cart-nav-badge">{totalItems}</span>
                        )}
                    </button>

                    {/* User Auth Buttons */}
                    {user ? (
                        <div className="user-profile-menu">
                            <span className="user-greeting">
                                <span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                                <span className="user-name">{user.name?.split(' ')[0]}</span>
                            </span>
                            <button onClick={handleLogout} className="logout-btn">
                                {t.nav?.logout || 'Logout'}
                            </button>
                        </div>
                    ) : (
                        <div className="auth-nav-buttons">
                            <Link to="/login" className="login-btn">
                                {t.nav?.login || 'Login'}
                            </Link>
                            <Link to="/register" className="register-btn">
                                {t.nav?.register || 'Register'}
                            </Link>
                        </div>
                    )}

                    {/* Mobile Hamburger Toggle */}
                    <button
                        className="mobile-hamburger"
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="mobile-menu-overlay">
                    <div className="mobile-menu-links">
                        <NavLink to="/" end onClick={() => setMobileMenuOpen(false)}>
                            {t.nav?.home || 'Home'}
                        </NavLink>
                        <NavLink to="/menu" onClick={() => setMobileMenuOpen(false)}>
                            {t.nav?.menu || 'Menu'}
                        </NavLink>
                        {user && (
                            <NavLink to="/orders" onClick={() => setMobileMenuOpen(false)}>
                                {t.nav?.orders || 'My Orders'}
                            </NavLink>
                        )}
                        <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>
                            {t.nav?.contact || 'Contact'}
                        </NavLink>
                        {user?.role === 'admin' && (
                            <NavLink to="/admin/menu" onClick={() => setMobileMenuOpen(false)}>
                                🛡️ Admin Panel
                            </NavLink>
                        )}
                        <div className="mobile-auth-section">
                            {user ? (
                                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="logout-btn w-full">
                                    {t.nav?.logout || 'Logout'} ({user.name})
                                </button>
                            ) : (
                                <div className="flex gap-2 w-full">
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="login-btn flex-1 text-center">
                                        {t.nav?.login || 'Login'}
                                    </Link>
                                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="register-btn flex-1 text-center">
                                        {t.nav?.register || 'Register'}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar