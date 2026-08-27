import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('cart')
            return saved ? JSON.parse(saved) : []
        } catch {
            return []
        }
    })
    const [isCartOpen, setIsCartOpen] = useState(false)

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems))
    }, [cartItems])

    const addToCart = (item, quantity = 1) => {
        setCartItems(prev => {
            const exists = prev.find(i => i._id === item._id)
            if (exists) {
                return prev.map(i =>
                    i._id === item._id ? { ...i, quantity: i.quantity + quantity } : i
                )
            }
            return [...prev, { ...item, quantity }]
        })
    }

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(i => i._id !== id))
    }

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) {
            removeFromCart(id)
            return
        }
        setCartItems(prev =>
            prev.map(i => i._id === id ? { ...i, quantity } : i)
        )
    }

    const clearCart = () => {
        setCartItems([])
        localStorage.removeItem('cart')
    }

    const openCart = () => setIsCartOpen(true)
    const closeCart = () => setIsCartOpen(false)

    const totalPrice = cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
    const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0)

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalPrice,
            totalItems,
            isCartOpen,
            setIsCartOpen,
            openCart,
            closeCart
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)