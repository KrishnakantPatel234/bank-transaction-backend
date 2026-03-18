import mongoose from "mongoose";

const tokenBlackListSchema = new mongoose.Schema({
    token : {
        type : String,
        reqired : [true , "token is required to blacklist"],
        unique : [true , "Token is already blacklisted"]
    }
}, { timestamps : true });

tokenBlackListSchema.index({createdAt : 1} , {
    expireAfterSeconds : 60*60*24*3  // 3 days
});

const tokenBlackList = mongoose.model("tokenBlackList" , tokenBlackListSchema);

export default tokenBlackList;