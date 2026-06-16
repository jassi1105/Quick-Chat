import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getUsersForSidebar ,getCoversationsForSidebar,getMessages} from '../controllers/message.controller.js';
import { upload } from '../middlewares/upload.middleware.js';

const router=express.Router();

router.use(protectRoute);

router.get('/users',getUsersForSidebar)
router.get("/conversations",getCoversationsForSidebar)
router.get("/:id",upload.single("media"),getMessages);

//todo: show this in the frontend

export default router;