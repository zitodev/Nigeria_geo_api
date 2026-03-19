const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message: "unauthorized"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userInfo = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

const authorize = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.userInfo.role)) {
      return res.status(403).json({
        message: "You are not allowed to perform this action"
      });
    }

    next();
  };
};

const logout = async (req, res)=>{
    res.cookie("token", "",{
        httpOnly: true,
        expires: new Date(0)
    });

    res.json({message: "Logged out successful"})

}

module.exports = {auth, logout, authorize};