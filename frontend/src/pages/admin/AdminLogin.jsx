import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const loginHandler = async (e) => {
        e.preventDefault()

        if (!email || !password) {
            toast.error('Please enter admin credentials')
            return
        }

        setLoading(true)
        try {
            const res = await api.post('/auth/login', { email, password })

            if (res.data.user?.role !== 'admin') {
                toast.error('Access denied. Administrator privileges required.')
                setLoading(false)
                return
            }

            login(res.data.user, res.data.token)
            toast.success(`Welcome to Admin Panel, ${res.data.user.name}! 🛡️`)
            navigate('/admin/menu')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed. Invalid credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0706] flex items-center justify-center pt-16 pb-12 px-4">
            <div className="w-full max-w-md bg-[#140e0b] border border-[#A67B5B]/30 p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-full bg-[#1e140f] border border-[#A67B5B]/40 flex items-center justify-center text-2xl mx-auto mb-3">
                        🛡️
                    </div>
                    <h2 className="text-2xl font-serif text-[#f0e8df]">Executive Admin Portal</h2>
                    <p className="text-xs text-gray-400 mt-1">
                        Management access for Pastarella menu and kitchen orders
                    </p>
                </div>

                <form onSubmit={loginHandler} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                            Admin Email
                        </label>
                        <input
                            type="email"
                            placeholder="admin@pastarella.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#1b1410] border border-[#A67B5B]/25 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#A67B5B]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                            Password
                        </label>
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
                        {loading ? 'Authenticating...' : 'Sign In as Admin'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-gray-400">
                    <p>
                        Default Admin: <code className="text-[#A67B5B]">admin@pastarella.com</code> / <code className="text-[#A67B5B]">admin123</code>
                    </p>
                    <Link to="/" className="inline-block mt-3 text-gray-500 hover:text-white text-[11px]">
                        ← Back to Restaurant Homepage
                    </Link>
                </div>
            </div>
        </div>
    )
}