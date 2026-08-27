import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'

import Home from './pages/Home'
import Menu from './pages/Menu'
import Orders from './pages/Orders'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'

import AdminMenu from './pages/admin/AdminMenu'
import AdminLogin from './pages/admin/AdminLogin'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0e0a08] text-white">
      {/* Toast Provider */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a120d',
            color: '#f0e8df',
            border: '1px solid rgba(166, 123, 91, 0.3)',
            fontSize: '13px',
            borderRadius: '8px'
          },
          success: {
            iconTheme: {
              primary: '#A67B5B',
              secondary: '#0e0a08'
            }
          },
          error: {
            iconTheme: {
              primary: '#f87171',
              secondary: '#0e0a08'
            }
          }
        }}
      />

      {/* Global Navigation */}
      <Navbar />

      {/* Global Cart Slide-over */}
      <CartDrawer />

      {/* Main App Content */}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<Contact />} />
          <Route path="/delivery" element={<Navigate to="/menu" replace />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Navigate to="/admin/menu" replace />} />
          <Route path="/admin/menu" element={<AdminMenu />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App