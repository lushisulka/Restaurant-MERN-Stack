import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem('token')
            const savedUser = localStorage.getItem('user')

            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser))
                } catch {
                    localStorage.removeItem('user')
                }
            }

            if (savedToken) {
                try {
                    const res = await api.get('/auth/me')
                    setUser(res.data)
                    localStorage.setItem('user', JSON.stringify(res.data))
                } catch {
                    // Token expired or invalid
                    logout()
                }
            }
            setLoading(false)
        }

        initAuth()
    }, [])

    const login = (userData, userToken) => {
        setUser(userData)
        setToken(userToken)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', userToken)
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)