import {getAuth} from '@clerk/express';
import User from '../models/user.js';

export const protectRoute = async (req, res, next) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Check if the user exists in the database
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach user info to the request object for downstream use
        req.user = user;
        next();
    } catch (error) {
        console.error('Error in protectRoute middleware:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};      