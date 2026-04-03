import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useEffect, useRef } from 'react'
import './Navbar.css'

const Navbar = () => {
    const { user, logout } = useAuth()
    const { t, language, changeLanguage } = useLanguage()

    const navRef = useRef(null)
    const lastScrollY = useRef(0)

    useEffect(() => {
        const handleScroll = () => {
            const nav = navRef.current
            const hero = document.getElementById('hero')

            if (!nav || !hero) return

            const heroBottom = hero.offsetTop + hero.offsetHeight

            if (window.scrollY >= heroBottom - 80) {
                nav.classList.add('hidden')
            } else {
                nav.classList.remove('hidden')
            }

            if (window.scrollY > 20) {
                nav.classList.add('scrolled')
            } else {
                nav.classList.remove('scrolled')
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <nav className="navbar" ref={navRef}>
            <div className="navbar-container">

                <Link to="/" className="logo">
                    <img src="/images/logo.png" alt="OurTime" className="logo-img" />
                    <span>Pastarella
                        {/* <strong> Out</strong> */}
                    </span>
                </Link>

                <div className="nav-links">
                    <NavLink to="/" end>{t.nav.home}</NavLink>
                    <NavLink to="/about">{t.nav.about}</NavLink>
                    <NavLink to="/menu">{t.nav.menu}</NavLink>
                    <NavLink to="/delivery">{t.nav.delivery}</NavLink>
                    <NavLink to="/contact">{t.nav.contact}</NavLink>
                </div>

                <div className="nav-actions">

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
                                >
                                    {lang.code.toUpperCase()}
                                </button>
                                <span className="lang-tooltip">{lang.label}</span>
                            </div>
                        ))}
                    </div>

                    {user ? (
                        <button onClick={logout} className="logout-btn">
                            {t.nav.logout}
                        </button>
                    ) : (
                        <Link to="/login" className="login-btn">
                            {t.nav.login}
                        </Link>
                    )}

                </div>
            </div>
        </nav>
    )
}

export default Navbar