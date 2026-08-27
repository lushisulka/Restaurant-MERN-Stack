const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'supersecretkey123', {
        expiresIn: '7d'
    })
}

// REGISTER
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' })
        }

        const existingUser = await User.findByEmail(email.trim().toLowerCase())
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            role: 'user'
        })

        const token = generateToken(user.id, user.role)

        res.status(201).json({
            token,
            user: {
                id: user.id,
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' })
        }

        const user = await User.findByEmail(email.trim().toLowerCase())
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const token = generateToken(user.id, user.role)

        res.json({
            token,
            user: {
                id: user.id,
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// GET ME
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.json({
            id: user.id,
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}