
import User from '../models/user.js';
import Message from '../models/message.js';
import { hasImageKitConfig, uploadChatMedia } from "../libs/imagekit.js";
import { getReceiverSocketId } from '../libs/socket.js'; 

export const getUsersForSidebar=async (req,res)=>{
try{
    const loggedInUserId=req.user._id;
    const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-clerkId");
    res.status(200).json(filteredUsers);

}catch(err){    
    console.error("Error fetching users for sidebar:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
}
} 

export const getCoversationsForSidebar=async (req, res) => {
    try{
        const loggedInUserId = req.user._id;

    const conversations = await Message.aggregate([
          // 1. Keep only the messages I sent or received.
      { $match: { $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }] } },
      // 2. Collapse them into one row per chat partner, noting our latest message time.
      {
        $group: {
          // The partner is the other person on the message (not me).
          _id: { $cond: [{ $eq: ["$senderId", loggedInUserId] }, "$receiverId", "$senderId"] },
          lastMessageAt: { $max: "$createdAt" },
        },
      },
      // 3. Put the most recent conversation at the top.
      { $sort: { lastMessageAt: -1 } },
      // 4. Look up each partner's user profile (comes back as an array).
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      // 5. Pull that profile out of the array and make it the document.
      { $replaceRoot: { newRoot: { $first: "$user" } } },
      // 6. Hide the private clerkId field from the result.
      { $project: { clerkId: 0 } },
    ]);

    res.status(200).json(conversations);


    }catch(err){
        console.error("Error in getConversationsForSidebar:", err.message);
        res.status(500).json({ message: "Internal server error" });

    }
}

export const getMessages=async (req,res)=>{
    try{
        const {id: userTo}=req.params;
        const myId=req.user._id;

        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:userTo},
                {senderId:userTo,receiverId:myId}
            ]
        }).sort({createdAt:1});
        
        res.status(200).json(messages);


    }catch(err){
        console.error("Error in getMessages:", err.message);
        res.status(500).json({ message: "Internal server error" });


    }
}

export const sendMessage=async (req,res)=>{
    try{
        const {text}=req.body;
        const {id: receiverId}=req.params;
        const senderId=req.user._id;

        let imageUrl;
        let videoUrl;

        if (req.file) {
            if (!hasImageKitConfig()) {
                return res.status(500).json({ message: "Image upload not configured" });
            }

            const url= await uploadChatMedia(req.file);

            if (req.file.mimetype.startsWith("image/")) {
                imageUrl=url;
            } else  {
                videoUrl=url;
            }
        }
        
        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
            video:videoUrl,
        });
        await newMessage.save();

        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            server.to(receiverSocketId).emit("newMessage",newMessage);
        }




        res.status(201).json(newMessage);

    }catch(err){
        console.error("Error in sendMessage:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
}