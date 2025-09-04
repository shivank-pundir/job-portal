// server/server.js
import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from '@sentry/node'
import { clerkWebhook } from './controllers/webhook.js'

const app = express()

// Connect DB
await connectDB()

// CORS (adjust origins if you want to restrict)
app.use(cors())

// ✅ Use raw body ONLY for Clerk webhook
app.post('/webhooks', express.raw({ type: '*/*' }), clerkWebhook)

// ✅ JSON parser for everything else (must be AFTER the webhook route)
app.use(express.json())

app.get('/', (req, res) => res.send('Api working'))

// Sentry test route (optional)
app.get('/debug-sentry', () => { throw new Error('my first sentry error') })

const PORT = process.env.PORT || 5000
Sentry.setupExpressErrorHandler(app)

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`))
