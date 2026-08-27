import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const { t } = useLanguage()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error('Please provide email and password')
            return
        }

        setLoading(true)
        try {
            const res = await api.post('/auth/login', { email, password })
            login(res.data.user, res.data.token)
            toast.success(`Welcome back, ${res.data.user?.name || 'Guest'}!`)

            if (res.data.user?.role === 'admin') {
                navigate('/admin/menu')
            } else {
                navigate('/')
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials. Please try again.')
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
                        {t.auth?.loginTitle || 'Welcome Back'}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                        Sign in to manage your orders and track delivery
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                            {t.auth?.email || 'Email'}
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
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="text-xs uppercase tracking-wider text-gray-400">
                                {t.auth?.password || 'Password'}
                            </label>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#1b1410] border border-[#A67B5B]/25 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#A67B5B]"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#A67B5B] hover:bg-[#c49070] text-[#0e0a08] font-bold text-xs uppercase tracking-widest py-3.5 rounded-lg transition shadow-lg mt-2"
                    >
                        {loading ? (t.common?.loading || 'Logging in...') : (t.auth?.loginButton || 'Login')}
                    </button>
                </form>

                {/* Footer Switch */}
                <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-gray-400 space-y-3">
                    <p>
                        {t.auth?.noAccount || "Don't have an account?"}{' '}
                        <Link to="/register" className="text-[#A67B5B] hover:underline font-semibold">
                            {t.auth?.registerButton || 'Register here'}
                        </Link>
                    </p>
                    <p className="text-[11px] text-gray-500">
                        Restaurant staff or manager?{' '}
                        <Link to="/admin/login" className="text-gray-400 hover:text-[#A67B5B] underline">
                            Admin Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}