
export const checkAuth = (req, res,next) => {
    if (req.user) {
        return res.status(200).json({ message: 'Authenticated', user: req.user });
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    
};  
