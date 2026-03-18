import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

async function authMiddleware(req , res , next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message : "Unauthorized access , token is missing"
        })
    }

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.userId);

        req.user = user;
        return next();
    }catch(error){
            return res.status(401).json({
                message : "Unauthorized access , token is invalid"
            })
    }
}

async function authSystemUserMiddleware(req , res , next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message : "Unauthorized access , token is missing"
        })
    }

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("+systemUser");
        
        if(!user.systemUser){
            return res.status(403).json({
                message : "Forbidden Access, not a system user"
            })
        }
        req.user = user;
        return next();

    }catch(error){
        return res.status(401).json({
            message : "Unauthorized Access, token is invalid"
        })
    }
}

export {
    authMiddleware,
    authSystemUserMiddleware
}

