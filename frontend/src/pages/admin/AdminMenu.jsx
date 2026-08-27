import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function AdminMenu() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState('menu') // 'overview' | 'menu' | 'orders'
    const [stats, setStats] = useState(null)

    // Menu state
    const [menu, setMenu] = useState([])
    const [loadingMenu, setLoadingMenu] = useState(true)
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('Pasta')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const [editingDishId, setEditingDishId] = useState(null)
    const [savingDish, setSavingDish] = useState(false)

    // Orders state
    const [orders, setOrders] = useState([])
    const [loadingOrders, setLoadingOrders] = useState(true)
    const [statusFilter, setStatusFilter] = useState('all')

    // Verify Admin role
    useEffect(() => {
        if (user && user.role !== 'admin') {
            toast.error('Access restricted to administrators')
            navigate('/')
        }
    }, [user, navigate])

    // Load initial data
    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats')
            setStats(res.data)
        } catch (err) {
            console.error('Failed to fetch admin stats:', err)
        }
    }

    const fetchMenu = async () => {
        setLoadingMenu(true)
        try {
            const res = await api.get('/menu')
            setMenu(res.data)
        } catch {
            toast.error('Failed to load menu items')
        } finally {
            setLoadingMenu(false)
        }
    }

    const fetchOrders = async () => {
        setLoadingOrders(true)
        try {
            const res = await api.get('/orders')
            setOrders(res.data)
        } catch {
            toast.error('Failed to load orders')
        } finally {
            setLoadingOrders(false)
        }
    }

    useEffect(() => {
        fetchStats()
        fetchMenu()
        fetchOrders()
    }, [])

    // Create or Edit Menu Item
    const handleSubmitMenu = async (e) => {
        e.preventDefault()

        if (!name.trim() || !price || !category) {
            toast.error('Please provide name, price, and category')
            return
        }

        setSavingDish(true)
        try {
            const payload = {
                name: name.trim(),
                price: parseFloat(price),
                category,
                description: description.trim(),
                image: image.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600'
            }

            if (editingDishId) {
                await api.put(`/menu/${editingDishId}`, payload)
                toast.success('Dish updated successfully! ✨')
            } else {
                await api.post('/menu', payload)
                toast.success('New dish added to menu! 🍝')
            }

            // Reset form
            setName('')
            setPrice('')
            setCategory('Pasta')
            setDescription('')
            setImage('')
            setEditingDishId(null)

            fetchMenu()
            fetchStats()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error saving menu item')
        } finally {
            setSavingDish(false)
        }
    }

    const handleEditClick = (dish) => {
        setEditingDishId(dish._id)
        setName(dish.name)
        setPrice(dish.price)
        setCategory(dish.category)
        setDescription(dish.description || '')
        setImage(dish.image || '')
        setActiveTab('menu')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleCancelEdit = () => {
        setEditingDishId(null)
        setName('')
        setPrice('')
        setCategory('Pasta')
        setDescription('')
        setImage('')
    }

    const handleDeleteDish = async (id, dishName) => {
        if (!window.confirm(`Are you sure you want to delete "${dishName}"?`)) return

        try {
            await api.delete(`/menu/${id}`)
            toast.success(`"${dishName}" deleted`)
            fetchMenu()
            fetchStats()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete dish')
        }
    }

    const handleToggleAvailability = async (dish) => {
        try {
            await api.put(`/menu/${dish._id}`, { isAvailable: !dish.isAvailable })
            toast.success(`${dish.name} is now ${!dish.isAvailable ? 'Available' : 'Out of Stock'}`)
            fetchMenu()
        } catch {
            toast.error('Failed to update status')
        }
    }

    // Update Order Status
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus })
            toast.success(`Order #${orderId.slice(-6).toUpperCase()} updated to ${newStatus}`)
            fetchOrders()
            fetchStats()
        } catch {
            toast.error('Failed to update order status')
        }
    }

    const filteredOrders = orders.filter(order => {
        if (statusFilter === 'all') return true
        return order.status === statusFilter
    })

    return (
        <div className="min-h-screen bg-[#0a0706] text-[#e8ddd5] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Admin Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-[#A67B5B]/20">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-[#A67B5B]/20 text-[#A67B5B] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#A67B5B]/30">
                                Administrator Control
                            </span>
                            <span className="text-xs text-gray-500">Logged in as {user?.name}</span>
                        </div>
                        <h1 className="text-3xl font-serif text-[#f0e8df]">Executive Management Hub</h1>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-2 bg-[#140e0b] p-1.5 rounded-xl border border-[#A67B5B]/20">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                                activeTab === 'overview'
                                    ? 'bg-[#A67B5B] text-[#0e0a08]'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            📊 Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('menu')}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                                activeTab === 'menu'
                                    ? 'bg-[#A67B5B] text-[#0e0a08]'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            🍕 Dishes ({menu.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                                activeTab === 'orders'
                                    ? 'bg-[#A67B5B] text-[#0e0a08]'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            📦 Orders ({orders.length})
                        </button>
                    </div>
                </div>

                {/* TAB 1: OVERVIEW & STATS */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-[#140e0b] border border-[#A67B5B]/20 rounded-xl p-6 shadow-lg">
                                <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Total Revenue</span>
                                <div className="text-3xl font-serif text-[#A67B5B] font-bold">
                                    €{stats?.totalRevenue ? stats.totalRevenue.toFixed(2) : '0.00'}
                                </div>
                                <span className="text-xs text-emerald-400 mt-2 block">✓ From completed orders</span>
                            </div>

                            <div className="bg-[#140e0b] border border-[#A67B5B]/20 rounded-xl p-6 shadow-lg">
                                <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Total Orders</span>
                                <div className="text-3xl font-serif text-[#f0e8df] font-bold">
                                    {stats?.totalOrders || 0}
                                </div>
                                <div className="flex gap-2 text-xs mt-2 text-gray-400">
                                    <span className="text-amber-400">{stats?.pendingOrders || 0} Pending</span>
                                    <span>•</span>
                                    <span className="text-blue-400">{stats?.preparingOrders || 0} Preparing</span>
                                </div>
                            </div>

                            <div className="bg-[#140e0b] border border-[#A67B5B]/20 rounded-xl p-6 shadow-lg">
                                <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Menu Items</span>
                                <div className="text-3xl font-serif text-[#f0e8df] font-bold">
                                    {menu.length}
                                </div>
                                <span className="text-xs text-gray-400 mt-2 block">Active offerings</span>
                            </div>

                            <div className="bg-[#140e0b] border border-[#A67B5B]/20 rounded-xl p-6 shadow-lg">
                                <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Registered Users</span>
                                <div className="text-3xl font-serif text-[#f0e8df] font-bold">
                                    {stats?.totalUsers || 0}
                                </div>
                                <span className="text-xs text-gray-400 mt-2 block">Customer accounts</span>
                            </div>
                        </div>

                        {/* Recent Orders Quick View */}
                        <div className="bg-[#140e0b] border border-[#A67B5B]/20 rounded-xl p-6 shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-serif text-[#f0e8df]">Recent Orders</h3>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className="text-xs text-[#A67B5B] hover:underline uppercase tracking-wider font-semibold"
                                >
                                    View All Orders →
                                </button>
                            </div>

                            <div className="space-y-3">
                                {orders.slice(0, 5).map((ord) => (
                                    <div key={ord._id} className="flex justify-between items-center p-3 bg-black/30 rounded-lg border border-white/5 text-sm">
                                        <div>
                                            <span className="font-mono text-xs text-[#A67B5B] mr-3">
                                                #{ord._id.slice(-6).toUpperCase()}
                                            </span>
                                            <span className="text-white font-medium">
                                                {ord.user?.name || 'Customer'}
                                            </span>
                                            <span className="text-xs text-gray-400 ml-2">
                                                ({ord.items?.length || 0} items)
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-white">€{ord.totalPrice?.toFixed(2)}</span>
                                            <span className={`px-2.5 py-0.5 text-xs rounded-full uppercase font-semibold ${
                                                ord.status === 'delivered' ? 'bg-emerald-950 text-emerald-300' :
                                                ord.status === 'preparing' ? 'bg-blue-950 text-blue-300' :
                                                ord.status === 'cancelled' ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                                            }`}>
                                                {ord.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: MENU DISHES MANAGEMENT */}
                {activeTab === 'menu' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Column */}
                        <div className="bg-[#140e0b] border border-[#A67B5B]/25 rounded-2xl p-6 shadow-xl h-fit">
                            <h3 className="text-xl font-serif text-[#f0e8df] mb-1">
                                {editingDishId ? 'Edit Menu Dish' : 'Add New Dish'}
                            </h3>
                            <p className="text-xs text-gray-400 mb-6">
                                {editingDishId ? 'Update pricing or description' : 'Introduce a new specialty to the menu'}
                            </p>

                            <form onSubmit={handleSubmitMenu} className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Dish Name *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Fettuccine Alfredo"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-[#1b1410] border border-[#A67B5B]/20 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#A67B5B]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Price (€) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="12.50"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="w-full bg-[#1b1410] border border-[#A67B5B]/20 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#A67B5B]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Category *</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full bg-[#1b1410] border border-[#A67B5B]/20 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#A67B5B]"
                                        >
                                            <option value="Pasta">Pasta</option>
                                            <option value="Pizza">Pizza</option>
                                            <option value="Salad">Salad</option>
                                            <option value="Burger">Burger</option>
                                            <option value="Sushi">Sushi</option>
                                            <option value="Waffle">Waffle</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Image URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://images.unsplash.com/..."
                                        value={image}
                                        onChange={(e) => setImage(e.target.value)}
                                        className="w-full bg-[#1b1410] border border-[#A67B5B]/20 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#A67B5B]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Description</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Authentic ingredients, flavors, and allergens..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full bg-[#1b1410] border border-[#A67B5B]/20 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-[#A67B5B]"
                                    />
                                </div>

                                <div className="flex gap-2 pt-2">
                                    {editingDishId && (
                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={savingDish}
                                        className="flex-1 bg-[#A67B5B] hover:bg-[#c49070] text-[#0e0a08] font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition"
                                    >
                                        {savingDish ? 'Saving...' : editingDishId ? 'Update Dish' : 'Create Dish'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* List Column */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="text-xl font-serif text-[#f0e8df] mb-4">Current Dishes ({menu.length})</h3>

                            {loadingMenu ? (
                                <div className="text-center py-10 text-gray-400">Loading menu list...</div>
                            ) : menu.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 bg-[#140e0b] rounded-xl border border-white/5">
                                    No dishes yet. Add your first dish using the form on the left.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {menu.map((dish) => (
                                        <div
                                            key={dish._id}
                                            className="bg-[#140e0b] border border-[#A67B5B]/15 rounded-xl p-4 flex flex-col justify-between hover:border-[#A67B5B]/35 transition shadow-md"
                                        >
                                            <div className="flex gap-4 mb-3">
                                                <img
                                                    src={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
                                                    alt={dish.name}
                                                    className="w-16 h-16 rounded-lg object-cover bg-black/40 border border-white/10 shrink-0"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-serif text-white font-semibold text-base">{dish.name}</h4>
                                                        <span className="text-[#A67B5B] font-bold text-sm">€{dish.price?.toFixed(2)}</span>
                                                    </div>
                                                    <span className="text-[11px] text-gray-400 bg-black/40 px-2 py-0.5 rounded border border-white/5 inline-block my-1">
                                                        {dish.category}
                                                    </span>
                                                    <p className="text-xs text-gray-400 line-clamp-2">{dish.description}</p>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                                                <button
                                                    onClick={() => handleToggleAvailability(dish)}
                                                    className={`px-2.5 py-1 rounded-full font-medium ${
                                                        dish.isAvailable !== false
                                                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                                                    }`}
                                                >
                                                    {dish.isAvailable !== false ? '● In Stock' : '○ Out of Stock'}
                                                </button>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(dish)}
                                                        className="text-gray-300 hover:text-white px-2 py-1 bg-white/5 rounded hover:bg-white/10 transition"
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteDish(dish._id, dish.name)}
                                                        className="text-rose-400 hover:text-rose-300 px-2 py-1 bg-rose-950/40 rounded border border-rose-800/40 transition"
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 3: ORDERS MANAGEMENT */}
                {activeTab === 'orders' && (
                    <div className="space-y-6">
                        {/* Orders Filter */}
                        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#140e0b] p-4 rounded-xl border border-[#A67B5B]/20">
                            <h3 className="text-xl font-serif text-[#f0e8df]">
                                Incoming Orders ({filteredOrders.length})
                            </h3>
                            <div className="flex gap-2">
                                {['all', 'pending', 'preparing', 'delivered', 'cancelled'].map((st) => (
                                    <button
                                        key={st}
                                        onClick={() => setStatusFilter(st)}
                                        className={`px-3 py-1.5 rounded-lg text-xs uppercase font-medium transition ${
                                            statusFilter === st
                                                ? 'bg-[#A67B5B] text-[#0e0a08] font-bold'
                                                : 'bg-black/40 text-gray-400 border border-white/5 hover:border-white/20'
                                        }`}
                                    >
                                        {st}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loadingOrders ? (
                            <div className="text-center py-12 text-gray-400">Loading incoming orders...</div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="text-center py-12 bg-[#140e0b] rounded-xl border border-[#A67B5B]/10 p-6">
                                <span className="text-3xl block mb-2">📦</span>
                                <p className="text-gray-400 text-sm">No orders matching status "{statusFilter}".</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredOrders.map((order) => (
                                    <div
                                        key={order._id}
                                        className="bg-[#140e0b] border border-[#A67B5B]/20 rounded-xl p-6 shadow-lg flex flex-col md:flex-row justify-between gap-6"
                                    >
                                        <div className="space-y-3 flex-1">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="font-mono text-xs text-[#A67B5B] font-bold">
                                                    #{order._id.slice(-6).toUpperCase()}
                                                </span>
                                                <span className="text-white font-medium text-sm">
                                                    👤 {order.user?.name || 'Guest User'} ({order.user?.email || 'N/A'})
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    🕒 {new Date(order.createdAt).toLocaleString()}
                                                </span>
                                            </div>

                                            {/* Items */}
                                            <div className="bg-black/30 p-3 rounded-lg border border-white/5 space-y-1.5">
                                                {order.items?.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-xs text-gray-300">
                                                        <span>
                                                            <strong className="text-[#A67B5B]">{item.quantity}x</strong>{' '}
                                                            {item.menuItem?.name || 'Item'}
                                                        </span>
                                                        <span>€{((item.price || item.menuItem?.price || 0) * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="text-xs text-gray-400 flex items-center gap-1">
                                                <span>📍 Address:</span>
                                                <span className="text-gray-200 font-medium">{order.address}</span>
                                            </div>
                                        </div>

                                        {/* Status and Action Column */}
                                        <div className="flex flex-col justify-between items-end gap-4 min-w-[200px] border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                                            <div className="text-right">
                                                <span className="text-xs text-gray-400 block">Total Amount</span>
                                                <span className="text-2xl font-serif font-bold text-[#A67B5B]">
                                                    €{order.totalPrice?.toFixed(2)}
                                                </span>
                                            </div>

                                            <div className="w-full space-y-1.5">
                                                <label className="text-[11px] uppercase tracking-wider text-gray-400 block text-right">
                                                    Status
                                                </label>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                                    className="w-full bg-[#1b1410] border border-[#A67B5B]/30 text-white text-xs font-semibold rounded-lg p-2 focus:outline-none focus:border-[#A67B5B]"
                                                >
                                                    <option value="pending">⏳ Pending</option>
                                                    <option value="preparing">🍳 Preparing</option>
                                                    <option value="delivered">✅ Delivered</option>
                                                    <option value="cancelled">❌ Cancelled</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}