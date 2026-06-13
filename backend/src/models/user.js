import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    clerId:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true 
    },
    profile_picture:{
        type:String,
        default:'https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png'
    },
},
{timestamps:true}
)

const User = mongoose.model("User", userSchema);

export default User;
