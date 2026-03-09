import { getPayload } from 'payload'
import config from './../src/payload.config'

async function fetchSubscribers() {
  try {
    const payload = await getPayload({
      config,
    })

    const subscribers = await payload.find({
      collection: 'subscribers',
      limit: 1000,
    })

    console.log(JSON.stringify(subscribers.docs.map(sub => ({
      email: (sub as Record<string, unknown>).email,
      firstName: (sub as Record<string, unknown>).firstName,
      lastName: (sub as Record<string, unknown>).lastName,
      confirmed: (sub as Record<string, unknown>).confirmed
    })), null, 2))
    
    process.exit(0)
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    process.exit(1)
  }
}

fetchSubscribers()
