// server/server.js
import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from '@sentry/node';
import { clerkWebhook } from './controllers/webhook.js';
import companyRoutes from './routes/companyRouter.js';  
import connectCloudinary from './config/cloudinary.js';
import jobRouters from './routes/jobRoutes.js';
import userRouters from './routes/userRouters.js';
import { clerkMiddleware } from '@clerk/express'; // ✅ only need this

const app = express();

// connect DB + Cloudinary
await connectDB();
await connectCloudinary();

app.use(cors());

// ⚠️ Webhooks must be BEFORE JSON parsing
app.post('/webhooks', express.raw({ type: '*/*' }), clerkWebhook);

// parse JSON and form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clerk middleware for auth context
app.use(clerkMiddleware());

// register routes
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRouters);
app.use('/api/users', userRouters);

// test routes
app.get('/', (req, res) => res.send('Api working'));
app.get('/debug-sentry', () => { throw new Error('my first sentry error'); });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
