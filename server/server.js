import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js';
import * as Sentry from '@sentry/node';
import { clerkWebhook } from './controllers/webhook.js';

//Initialize app
const app = express();

//connect to database
await connectDB()

//Middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req,res) => 
    res.send("Api working")
);

app.get('/debug-sentry', function mainHandler(req, res) {
    throw new Error("my first sentry error");
});

app.post('/webhooks', clerkWebhook)

//port 
const PORT = process.env.PORT || 5000

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, ()=> {
    console.log(`App is listening on port ${PORT}`);
})