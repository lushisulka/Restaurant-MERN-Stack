import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import './Home.css'

const Home = () => {
    const { t } = useLanguage()

    return (
        <div className="home">

            {/* Hero Section */}
            <section className="hero">

                {/* Video Background */}
                <video autoPlay loop muted playsInline className="hero-video">
                    <source src="/videos/hero.mp4" type="video/mp4" />
                </video>

                <div className="hero-overlay" />
                <div className="hero-gradient" />

                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="pulse-dot" />
                        Open Now
                    </div>

                    <h1 className="hero-title">
                        {t.hero.title.split(' ').slice(0, 2).join(' ')}
                        <span>
                            {t.hero.title.split(' ').slice(2).join(' ')}
                        </span>
                    </h1>

                    <p className="hero-subtitle">
                        {t.hero.subtitle}
                    </p>

                    <div className="hero-buttons">
                        <Link to="/menu" className="btn primary">
                            {t.hero.button}
                        </Link>

                        <Link to="/menu" className="btn secondary">
                            {t.hero.delivery}
                        </Link>
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
                        { value: '30min', label: 'Delivery Time' },
                    ].map((stat, i) => (
                        <div key={i} className="stat">
                            <div className="stat-value">{stat.value}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="cta-box">
                    <h2>Ready to Order?</h2>
                    <p>
                        Explore our full menu and find your next favorite dish
                    </p>
                    <Link to="/menu" className="btn primary">
                        {t.hero.button} →
                    </Link>
                </div>
            </section>

        </div>
    )
}

export default Home