const express=require('express');
const env=require('dotenv');
const mongoose=require('mongoose');
env.config();



const app=express();

mongoose.connect(process.env.MONGO_URI).then(()=>{

    console.log("Database connected successfully");

}).catch((err)=>{

    console.log("Error while connecting to database " + err);

});

app.listen(process.env.PORT,()=>{

    console.log("server is running on port " + process.env.PORT);

});