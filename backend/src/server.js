import express from 'express';
import cors from 'cors';

import 'dotenv/config';

import fs from 'fs';
import path from 'path';

import { clerkMiddleware } from '@clerk/express';


import mongoose from 'mongoose';

//usermodel
import connectDB from './libs/db.js';
import job from './libs/cron.js';


import clerkWebhook from './webhooks/clerk.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import {server,app} from './libs/socket.js';

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

const publicDir = path.join(process.cwd(), "public");


// import { fileURLToPath } from 'url';




// // dotenv.config();

// const PORT = process.env.PORT || 3001;
// const FRONTEND_URL = process.env.FRONTEND_URL;

// // __dirname replacement for ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const publicDir = path.join(process.cwd(), 'public');
// app.use(express.json());
// app.use(clerkMiddleware());
// app.use('/api/webhooks/clerk',express.raw({ type: 'application/json' }), clerkWebhook); // Parse JSON for Clerk webhooks
// app.use('/api/auth',authRoutes)
// app.use('/api/messages',messageRoutes)


// app.use(
//   cors({
//     origin: FRONTEND_URL,
//     credentials: true,
//   })
// );



// app.get("/health", (req, res) => {
//   res.status(200).json({ ok: true });
// });


// // Serve frontend build if it exists
// if (fs.existsSync(publicDir)) {
//   app.use(express.static(publicDir));

//   app.get('/{*any}', (req, res, next) => {
//     res.sendFile(path.join(publicDir, 'index.html'), (err) => {
//       if (err) next(err);
//     });
//   });
// }



// server.listen(PORT, async () => {
//   try {
//     await connectDB();
//     console.log(`Server is running on port ${PORT}`);

//     if (process.env.NODE_ENV === 'production') {
//       job.start();
//       console.log('Cron job started');
//     } 

//   } catch (error) {
//     console.error('Database connection failed:', error);
//   }
// });






app.use("/api/webhooks/clerk", express.raw({ type: "application/json" }), clerkWebhook);

app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// if the public directory exists, serve the static files
// this is for the production build
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get("/{*any}", (req, res, next) => {
    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}

server.listen(PORT, () => {
  connectDB();
  console.log("Server is up and running on PORT:", PORT);

  if (process.env.NODE_ENV === "production") job.start();
});