import mongoose from "mongoose";
import User from "./user.models.js";

const accountSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true , "Account must be associated with a User"],
        index : true            
        // We use index so that when data is searched than the operations must be fast
    },
    status : {
        type : String,
        enum : {
            values : ["ACTIVE" , "FROZEN" , "CLOSED"],
            message : "status can be either ACTIVE , FROZEN or CLOSED",   
        },
        default : "ACTIVE"
    },
    currency : {
        type : String,
        required : [true , "Currency is for creating an account"],
        default : "INR"
    }
} , {
    timestamps : true
});

accountSchema.index({user : 1 , status : 1});

const Account = mongoose.model("Account" , accountSchema);
export default Account;