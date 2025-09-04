// server/controllers/webhook.js
import { Webhook } from 'svix'
import User from '../models/user.js'

export const clerkWebhook = async (req, res) => {
  try {
    const secret = process.env.CLERK_WEBHOOK_SECRET
    if (!secret) {
      console.error('❌ Missing CLERK_WEBHOOK_SECRET')
      return res.status(500).json({ success: false })
    }

    // req.body is a Buffer because of express.raw()
    const payload = req.body.toString('utf8')

    const headers = {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    }

    // Verify signature
    const wh = new Webhook(secret)
    wh.verify(payload, headers)

    // Parse event AFTER verification
    const event = JSON.parse(payload)
    const { type, data } = event

    console.log('👉 Clerk event:', type)

    if (type === 'user.created' || type === 'user.updated') {
      const email =
        data?.email_addresses?.[0]?.email_address || 'no-email@example.com'
      const name = `${data?.first_name || 'Anonymous'} ${data?.last_name || ''}`.trim()
      const image = data?.image_url || ''

      // Upsert by Clerk user id
      await User.findByIdAndUpdate(
        data.id,
        { _id: data.id, email, name, image, resume: '' },
        { upsert: true, new: true }
      )

      console.log('✅ User upserted in Mongo:', { id: data.id, email })
      return res.status(200).json({ success: true })
    }

    if (type === 'user.deleted') {
      await User.findByIdAndDelete(data.id)
      console.log('✅ User deleted from Mongo:', data.id)
      return res.status(200).json({ success: true })
    }

    console.log('ℹ️ Unhandled event type:', type)
    return res.status(200).json({ received: true })
  } catch (err) {
    console.error('❌ Clerk webhook error:', err.message)
    return res.status(400).json({ success: false, message: 'Webhook Error' })
  }
}
