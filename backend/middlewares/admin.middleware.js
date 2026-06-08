const adminMiddleware = (req, res, next) => {
    try{
        if(req.user.role !== 'admin'){
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    }catch(err){
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = adminMiddleware;