const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const { initDB } = require('./config/db')
const User = require('./models/User')

dotenv.config()

const createAdmin = async () => {
    try {
        await initDB()

        const adminEmail = 'admin@pastarella.com'
        const existing = await User.findByEmail(adminEmail)

        if (existing) {
            console.log(`ℹ️ Admin (${adminEmail}) already exists.`)
            process.exit(0)
        }

        const hashedPassword = await bcrypt.hash('admin123', 10)

        await User.create({
            name: 'Executive Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        })

        console.log('✅ Admin created successfully in MySQL!')
        process.exit(0)
    } catch (error) {
        console.error('❌ Failed to create admin:', error.message)
        process.exit(1)
    }
}

createAdmin()