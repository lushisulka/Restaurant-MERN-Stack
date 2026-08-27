import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import './CartDrawer.css'

const CartDrawer = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems, isCartOpen, closeCart } = useCart()
    const { user } = useAuth()
    const { t } = useLanguage()
    const navigate = useNavigate()

    const [address, setAddress] = useState('')
    const [submitting, setSubmitting] = useState(false)

    if (!isCartOpen) return null

    const handleCheckout = async (e) => {
        e.preventDefault()

        if (!user) {
            toast.error('Please login to complete your order')
            closeCart()
            navigate('/login')
            return
        }

        if (!address.trim()) {
            toast.error('Please provide a delivery address')
            return
        }

        if (cartItems.length === 0) {
            toast.error('Your cart is empty')
            return
        }

        setSubmitting(true)
        try {
            const formattedItems = cartItems.map(item => ({
                menuItem: item._id,
                quantity: item.quantity,
                price: item.price
            }))

            await api.post('/orders', {
                items: formattedItems,
                totalPrice: Number(totalPrice.toFixed(2)),
                address: address.trim()
            })

            toast.success('Order placed successfully! 🍕')
            clearCart()
            setAddress('')
            closeCart()
            navigate('/orders')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="cart-backdrop" onClick={closeCart}>
            <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
                <div className="cart-header">
                    <div className="cart-title-row">
                        <h3>{t.cart?.title || 'Your Cart'}</h3>
                        <span className="cart-badge">{totalItems} items</span>
                    </div>
                    <button className="cart-close-btn" onClick={closeCart} aria-label="Close cart">
                        ✕
                    </button>
                </div>

                <div className="cart-body">
                    {cartItems.length === 0 ? (
                        <div className="cart-empty-state">
                            <div className="empty-icon">🛒</div>
                            <p>{t.cart?.empty || 'Your cart is empty'}</p>
                            <button
                                className="btn primary view-menu-btn"
                                onClick={() => {
                                    closeCart()
                                    navigate('/menu')
                                }}
                            >
                                {t.hero?.button || 'Browse Menu'}
                            </button>
                        </div>
                    ) : (
                        <div className="cart-items-list">
                            {cartItems.map((item) => (
                                <div key={item._id} className="cart-item-card">
                                    <img
                                        src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
                                        alt={item.name}
                                        className="cart-item-img"
                                    />
                                    <div className="cart-item-details">
                                        <div className="cart-item-info">
                                            <h4 className="cart-item-title">{item.name}</h4>
                                            <p className="cart-item-price">€{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <div className="cart-item-controls">
                                            <div className="qty-control">
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    disabled={submitting}
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    disabled={submitting}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                className="cart-remove-btn"
                                                onClick={() => removeFromCart(item._id)}
                                                title="Remove item"
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <form onSubmit={handleCheckout} className="checkout-form">
                            <div className="address-field">
                                <label htmlFor="delivery-address">{t.orders?.address || 'Delivery Address'} *</label>
                                <input
                                    id="delivery-address"
                                    type="text"
                                    placeholder="e.g., Rruga Dëshmorët e Kombit, Apt 4B"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="cart-summary-breakdown">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>€{totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Delivery Fee</span>
                                    <span className="free-delivery">FREE</span>
                                </div>
                                <div className="summary-row total-row">
                                    <span>{t.cart?.total || 'Total'}</span>
                                    <span className="total-amount">€{totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            {!user && (
                                <p className="auth-alert-notice">
                                    ⚠️ Please log in to complete your checkout.
                                </p>
                            )}

                            <button
                                type="submit"
                                className="btn primary checkout-submit-btn"
                                disabled={submitting}
                            >
                                {submitting ? (t.common?.loading || 'Processing...') : (t.cart?.checkout || 'Confirm & Place Order')}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartDrawer
