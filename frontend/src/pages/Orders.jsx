import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import api from '../services/api'
import toast from 'react-hot-toast'

const Orders = () => {
    const { user, loading: authLoading } = useAuth()
    const { t } = useLanguage()
    const navigate = useNavigate()

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchMyOrders = async () => {
        setLoading(true)
        try {
            const res = await api.get('/orders/my-orders')
            setOrders(res.data)
        } catch (err) {
            toast.error('Failed to load your order history')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchMyOrders()
        } else if (!authLoading) {
            setLoading(false)
        }
    }, [user, authLoading])

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'preparing':
                return {
                    bg: 'bg-blue-900/40 text-blue-300 border-blue-600',
                    label: t.orders?.status?.preparing || 'Preparing'
                }
            case 'delivered':
                return {
                    bg: 'bg-emerald-900/40 text-emerald-300 border-emerald-600',
                    label: t.orders?.status?.delivered || 'Delivered'
                }
            case 'cancelled':
                return {
                    bg: 'bg-rose-900/40 text-rose-300 border-rose-600',
                    label: t.orders?.status?.cancelled || 'Cancelled'
                }
            case 'pending':
            default:
                return {
                    bg: 'bg-amber-900/40 text-amber-300 border-amber-600',
                    label: t.orders?.status?.pending || 'Pending'
                }
        }
    }

    if (!user && !authLoading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center pt-24 px-4">
                <div className="bg-[#140e0b] border border-[#A67B5B]/20 p-8 rounded-2xl max-w-md w-full text-center shadow-xl">
                    <span className="text-5xl block mb-4">🔐</span>
                    <h2 className="text-2xl font-serif text-white mb-2">Login Required</h2>
                    <p className="text-sm text-gray-400 mb-6">
                        Please login to view your active orders and ordering history.
                    </p>
                    <Link
                        to="/login"
                        className="inline-block w-full bg-[#A67B5B] hover:bg-[#c49070] text-[#0e0a08] font-bold text-xs uppercase tracking-wider py-3.5 rounded-lg transition"
                    >
                        {t.auth?.loginButton || 'Login Now'}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0e0a08] text-[#e8ddd5] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-[#A67B5B]/20">
                    <div>
                        <span className="text-xs font-semibold tracking-widest text-[#A67B5B] uppercase block mb-1">
                            Your Order History
                        </span>
                        <h1 className="text-3xl md:text-4xl font-serif text-[#f0e8df]">
                            {t.orders?.title || 'My Orders'}
                        </h1>
                    </div>
                    <Link
                        to="/menu"
                        className="bg-[#1b1410] border border-[#A67B5B]/30 hover:border-[#A67B5B] text-xs text-[#A67B5B] font-semibold uppercase tracking-wider py-2.5 px-5 rounded-full transition"
                    >
                        + Order More Food
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-400">
                        <div className="inline-block animate-spin text-3xl mb-3">🛵</div>
                        <p>{t.common?.loading || 'Loading your orders...'}</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-16 bg-[#140e0b] rounded-2xl border border-[#A67B5B]/15 p-8">
                        <span className="text-5xl block mb-4 opacity-60">📦</span>
                        <h3 className="text-xl font-serif text-white mb-2">{t.orders?.empty || 'No orders yet'}</h3>
                        <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
                            You have not placed any orders yet. Check out our fresh Italian menu and treat yourself!
                        </p>
                        <Link
                            to="/menu"
                            className="inline-block bg-[#A67B5B] hover:bg-[#c49070] text-[#0e0a08] font-bold text-xs uppercase tracking-wider py-3 px-8 rounded-lg transition"
                        >
                            {t.hero?.button || 'Browse Menu'}
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const badge = getStatusBadge(order.status)
                            const orderDate = new Date(order.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })

                            return (
                                <div
                                    key={order._id}
                                    className="bg-[#140e0b] border border-[#A67B5B]/15 rounded-xl p-6 hover:border-[#A67B5B]/35 transition shadow-lg"
                                >
                                    {/* Order Header */}
                                    <div className="flex flex-wrap justify-between items-center gap-3 pb-4 border-b border-white/5 mb-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-gray-400">Order ID:</span>
                                                <span className="font-mono text-xs text-[#A67B5B] font-semibold">
                                                    #{order._id.slice(-6).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500">{orderDate}</span>
                                        </div>

                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${badge.bg}`}>
                                            ● {badge.label}
                                        </span>
                                    </div>

                                    {/* Items List */}
                                    <div className="space-y-3 mb-4">
                                        {order.items?.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-6 h-6 rounded bg-[#1b1410] border border-[#A67B5B]/20 text-xs flex items-center justify-center text-[#A67B5B] font-bold">
                                                        {item.quantity}x
                                                    </span>
                                                    <span className="text-gray-200">
                                                        {item.menuItem?.name || 'Delicious Menu Item'}
                                                    </span>
                                                </div>
                                                <span className="text-gray-400 font-mono text-xs">
                                                    €{((item.price || item.menuItem?.price || 0) * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Footer & Address */}
                                    <div className="pt-4 border-t border-white/5 flex flex-wrap justify-between items-center gap-3 text-xs text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <span>📍</span>
                                            <span><strong>Delivery to:</strong> {order.address}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-gray-400">{t.orders?.total || 'Total'}:</span>
                                            <span className="text-lg font-bold text-[#A67B5B]">
                                                €{order.totalPrice?.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Orders