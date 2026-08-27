import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const { t } = useLanguage()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name.trim() || !email.trim() || !password) {
            toast.error('Please fill in all fields')
            return
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long')
            return
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setLoading(true)
        try {
            const res = await api.post('/auth/register', {
                name: name.trim(),
                email: email.trim(),
                password
            })

            login(res.data.user, res.data.token)
            toast.success(`Welcome to Pastarella, ${res.data.user?.name}! 🎉`)
            navigate('/menu')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0e0a08] text-[#e8ddd5] flex items-center justify-center pt-20 pb-16 px-4">
            <div className="w-full max-w-md bg-[#140e0b] border border-[#A67B5B]/20 rounded-2xl p-8 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <img src="/images/logo.png" alt="Pastarella" className="h-12 mx-auto mb-3" />
                    <h2 className="text-2xl font-serif text-[#f0e8df]">
                        {t.auth?.registerTitle || 'Create an Account'}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                        Join Pastarella to order fast and earn exclusive gourmet rewards
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                            {t.auth?.name || 'Full Name'} *
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Marco Rossi"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#1b1410] border border-[#A67B5B]/25 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#A67B5B]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                            {t.auth?.email || 'Email'} *
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#1b1410] border border-[#A67B5B]/25 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#A67B5B]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                            {t.auth?.password || 'Password'} *
                        </label>
                        <input
                            type="password"
                            placeholder="Min. 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#1b1410] border border-[#A67B5B]/25 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#A67B5B]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                            Confirm Password *
                        </label>
                        <input
                            type="password"
                            placeholder="Repeat password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-[#1b1410] border border-[#A67B5B]/25 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#A67B5B]"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#A67B5B] hover:bg-[#c49070] text-[#0e0a08] font-bold text-xs uppercase tracking-widest py-3.5 rounded-lg transition shadow-lg mt-2"
                    >
                        {loading ? (t.common?.loading || 'Creating account...') : (t.auth?.registerButton || 'Register Account')}
                    </button>
                </form>

                {/* Footer Switch */}
                <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-gray-400">
                    <p>
                        {t.auth?.haveAccount || 'Already have an account?'}{' '}
                        <Link to="/login" className="text-[#A67B5B] hover:underline font-semibold">
                            {t.auth?.loginButton || 'Login here'}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}