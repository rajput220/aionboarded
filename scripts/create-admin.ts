import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function createAdmin() {
    const payload = await getPayload({ config })
    
    try {
        console.log('Creating admin user...')
        await payload.create({
            collection: 'users',
            data: {
                name: 'Admin User',
                email: 'admin@aionboarded.ai',
                password: 'password123',
                role: 'admin',
            }
        })
        console.log('Admin user created!')
    } catch (e: any) {
        console.log('Admin user might already exist or error:', e.message)
    }
    process.exit(0)
}

createAdmin()
