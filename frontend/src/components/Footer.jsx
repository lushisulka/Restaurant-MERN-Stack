import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const Footer = () => {
    const { t } = useLanguage()

    return (
        <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

                <div>
                    <h3 className="text-orange-500 text-xl font-bold mb-3">RestaurantApp</h3>
                    <p className="text-gray-400 text-sm">
                        Pizza, Burgers, Sushi, Waffles & More
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-medium mb-3">Links</h4>
                    <div className="flex flex-col gap-2">
                        <Link to="/" className="text-gray-400 hover:text-orange-500 text-sm transition">{t.nav.home}</Link>
                        <Link to="/menu" className="text-gray-400 hover:text-orange-500 text-sm transition">{t.nav.menu}</Link>
                        <Link to="/contact" className="text-gray-400 hover:text-orange-500 text-sm transition">{t.nav.contact}</Link>
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-medium mb-3">{t.contact.hours}</h4>
                    <p className="text-gray-400 text-sm">Mon - Fri: 10:00 - 23:00</p>
                    <p className="text-gray-400 text-sm">Sat - Sun: 10:00 - 00:00</p>
                </div>

            </div>
            <div className="border-t border-gray-800 text-center py-4 text-gray-500 text-sm">
                © 2025 RestaurantApp. {t.footer.rights}
            </div>
        </footer>
    )
}

export default Footer