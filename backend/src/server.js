import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { clerkMiddleware } from '@clerk/express';

import connectDB from './libs/db.js';
import job from './libs/cron.js';
import clerkWebhook from './webhooks/clerk.js';
import authRoutes from './routes/auth.route.js';

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL;

// __dirname replacement for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(process.cwd(), 'public');

app.use('/api/webhooks/clerk',express.raw({ type: 'application/json' }), clerkWebhook); // Parse JSON for Clerk webhooks
app.use('/api/auth',authRoutes)
app.use(express.json());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});


// Serve frontend build if it exists
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get('/{*any}', (req, res, next) => {
    res.sendFile(path.join(publicDir, 'index.html'), (err) => {
      if (err) next(err);
    });
  });
}



app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);

    if (process.env.NODE_ENV === 'production') {
      job.start();
      console.log('Cron job started');
    } 

  } catch (error) {
    console.error('Database connection failed:', error);
  }
});