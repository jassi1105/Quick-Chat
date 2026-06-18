import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getUsersForSidebar ,getCoversationsForSidebar,getMessages,sendMessage} from '../controllers/message.controller.js';
import { upload } from '../middlewares/upload.middleware.js';

const router=express.Router();

router.use(protectRoute);

router.get('/users',getUsersForSidebar)
router.get("/conversations",getCoversationsForSidebar)
router.get("/:id", getMessages);
router.post("/send/:id", upload.single("media"), sendMessage);

//todo: show this in the frontend

export default router;