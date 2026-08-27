import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import toast from 'react-hot-toast'

const Contact = () => {
    const { t } = useLanguage()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [message, setMessage] = useState('')
    const [inquiryType, setInquiryType] = useState('Reservation')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!name.trim() || !email.trim() || !message.trim()) {
            toast.error('Please fill in all required fields')
            return
        }

        setSubmitting(true)
        setTimeout(() => {
            toast.success('Thank you! Your message has been received. Our team will contact you shortly.')
            setName('')
            setEmail('')
            setPhone('')
            setMessage('')
            setSubmitting(false)
        }, 600)
    }

    return (
        <div className="min-h-screen bg-[#0e0a08] text-[#e8ddd5] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="text-xs font-semibold tracking-widest text-[#A67B5B] uppercase block mb-2">
                        Get In Touch
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif text-[#f0e8df] tracking-tight mb-4">
                        {t.contact?.title || 'Contact & Reservations'}
                    </h1>
                    <p className="text-sm text-gray-400">
                        Have a special request, event reservation, or dietary question? We are always here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Information & Venue Card */}
                    <div className="space-y-6">
                        <div className="bg-[#140e0b] border border-[#A67B5B]/15 rounded-2xl p-8 shadow-xl">
                            <h2 className="text-2xl font-serif text-[#f0e8df] mb-6">
                                Restaurant Details
                            </h2>

                            <div className="space-y-5 text-sm">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#1b1410] border border-[#A67B5B]/30 flex items-center justify-center text-[#A67B5B] text-lg shrink-0">
                                        📍
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-0.5">{t.contact?.address || 'Address'}</h4>
                                        <p className="text-gray-400">Rruga Dëshmorët e Kombit, No. 42</p>
                                        <p className="text-gray-400">City Center, 10000</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#1b1410] border border-[#A67B5B]/30 flex items-center justify-center text-[#A67B5B] text-lg shrink-0">
                                        📞
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-0.5">{t.contact?.phone || 'Phone'}</h4>
                                        <p className="text-gray-400">+383 (0) 44 123 456</p>
                                        <p className="text-gray-400">+383 (0) 49 987 654</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#1b1410] border border-[#A67B5B]/30 flex items-center justify-center text-[#A67B5B] text-lg shrink-0">
                                        ✉️
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-0.5">{t.contact?.email || 'Email'}</h4>
                                        <p className="text-gray-400">reservations@pastarella.com</p>
                                        <p className="text-gray-400">support@pastarella.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#1b1410] border border-[#A67B5B]/30 flex items-center justify-center text-[#A67B5B] text-lg shrink-0">
                                        🕒
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-0.5">{t.contact?.hours || 'Opening Hours'}</h4>
                                        <p className="text-gray-400">Monday - Friday: 10:00 - 23:00</p>
                                        <p className="text-gray-400">Saturday - Sunday: 10:00 - 00:00</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Atmosphere quote */}
                        <div className="p-6 bg-gradient-to-br from-[#1b120d] to-[#120b08] border border-[#A67B5B]/20 rounded-2xl">
                            <p className="font-serif italic text-lg text-[#f0e8df] mb-2">
                                "Food brings people together on many different levels. It’s nourishment of the soul and body; it’s truly love."
                            </p>
                            <span className="text-xs text-[#A67B5B] uppercase tracking-wider block">— Head Chef Giuliano</span>
                        </div>
                    </div>

                    {/* Contact & Reservation Form */}
                    <div className="bg-[#140e0b] border border-[#A67B5B]/20 rounded-2xl p-8 shadow-xl">
                        <h2 className="text-2xl font-serif text-[#f0e8df] mb-2">
                            Send Us a Message
                        </h2>
                        <p className="text-xs text-gray-400 mb-6">
                            Reserve a table for dinner or ask any questions about our catering.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                                    Inquiry Type
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Reservation', 'Catering', 'General'].map((type) => (
                                        <button
                                            type="button"
                                            key={type}
                                            onClick={() => setInquiryType(type)}
                                            className={`py-2 text-xs rounded-lg font-medium transition ${
                                                inquiryType === type
                                                    ? 'bg-[#A67B5B] text-[#0e0a08] font-bold'
                                                    : 'bg-[#1b1410] text-gray-400 border border-white/5 hover:border-[#A67B5B]/30'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                                    {t.contact?.name || 'Your Full Name'} *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-[#1b1410] border border-[#A67B5B]/20 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#A67B5B]"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                                        {t.contact?.email || 'Email Address'} *
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#1b1410] border border-[#A67B5B]/20 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#A67B5B]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                                        {t.contact?.phone || 'Phone Number'}
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="+383 44 000 000"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-[#1b1410] border border-[#A67B5B]/20 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#A67B5B]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                                    {t.contact?.message || 'Your Message'} *
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Let us know date, time, party size or your inquiry details..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full bg-[#1b1410] border border-[#A67B5B]/20 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#A67B5B]"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-[#A67B5B] hover:bg-[#c49070] text-[#0e0a08] font-bold text-xs uppercase tracking-widest py-3.5 rounded-lg transition shadow-lg"
                            >
                                {submitting ? (t.common?.loading || 'Sending...') : (t.contact?.sendMessage || 'Send Message')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact