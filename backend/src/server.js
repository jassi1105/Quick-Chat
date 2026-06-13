const express=require('express');
const env=require('dotenv');
const mongoose=require('mongoose');
const cors=require('cors');

import { clerkMiddleware } from '@clerk/express'
const connectDB=require('./libs/db');


env.config();
const PORT=process.env.PORT;
const FRONTEND_URL=process.env.FRONTEND_URL;

const app=express();

app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(clerkMiddleware());

app.listen(PORT,()=>{
    connectDB();
    console.log("server is running on port " + process.env.PORT);
});