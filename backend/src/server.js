const express=require('express');
const env=require('dotenv');
const mongoose=require('mongoose');
const cors=require('cors');
const fs = require('fs');
const path = require('path');
import { clerkMiddleware } from '@clerk/express'
const connectDB=require('./libs/db');

const app=express();

env.config();
const PORT=process.env.PORT;
const FRONTEND_URL=process.env.FRONTEND_URL;

const publicDir=path.join(process.cwd(),'public');




app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(clerkMiddleware());


if (!fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
    app.get("/{*any}",(req,res,next)=>{
        res.sendFile(path.join(publicDir,"index.html"),(err)=>next(err));
    });
}

app.listen(PORT,()=>{
    connectDB();
    console.log("server is running on port " + process.env.PORT);
});