import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { sendRegistrationEmail } from "../services/email.service.js";
import tokenBlackList from "../models/blackList.models.js";

//Js doc comment (on hover it tells what is this function does wherever it is imported)
/**
 * - user register controller
 * - POST /api/auth/register
 */
const registerUser = async (req , res) => {
    const {email , password , name} = req.body;

    let user = await User.findOne({email});

    if(user){
        return res.status(422).json({
            message : "User already exists",
            status : "failed"
        })
    }

    user = await User.create({
        email,
        password,
        name,
    })

    const token = jwt.sign(
        {userId : user._id}, 
        process.env.JWT_SECRET,
        {expiresIn : "3d"}
    );

    res.cookie("token" , token);

    res.status(201).json({
        user : {
            _id : user._id,
            email : user.email,
            name : user.name
        },
        token
    })

    await sendRegistrationEmail(user.email , user.name);
}

/**
 * - user login controller
 * - POST /api/auth/login
 */
const loginUser = async (req , res) => {
    const {email , password} = req.body;

    let user = await User.findOne({email}).select("+password");    // as we declared "select : false" in usermodel

    if(!user){
        return res.status(401).json({
            message : "email or password is invalid"
        });
    }
    
    const isValidPassword = await user.comparePassword(password);

    if(!isValidPassword){
        return res.status(401).json({
            message : "email or password is invalid"
        });
    }

    const token = jwt.sign(
        {userId : user._id},
        process.env.JWT_SECRET,
        {expiresIn : "2d"}
    )

    res.cookie("token" , token);

    return res
        .status(200)
        .json({
            user :{
                _id : user._id,
                email : user.email,
                name : user.name
            },
            token
        })
}

/**
 * - user logout controller
 * - POST /api/auth/logout
 */
const logoutUser = async (req , res) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(200).json({
            message : "User logged out successfully"
        })
    }

    res.clearCookie("token");

    await tokenBlackList.create({
        token : token
    })

    return res.status(200).json({
        message : "User logged out successfully"
    })

}

export {
    registerUser,
    loginUser,
    logoutUser
}