const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const User = require('./models/User')

dotenv.config()

const createAdmin = async () => {
    await mongoose.connect(process.env.MONGODB_URI)

    const hashedPassword = await bcrypt.hash('admin123', 10)

    await User.create({
        name: 'Admin',
        email: 'admin@pastarella.com',
        password: hashedPassword,
        role: 'admin'
    })

    console.log('Admin created successfully!')
    process.exit()
}

createAdmin()