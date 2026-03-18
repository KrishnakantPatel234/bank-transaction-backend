import mongoose from "mongoose";
import User from "./user.models.js";
import Ledger from "./ledger.models.js";

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

accountSchema.methods.getBalance = async function(){
    const balanceData = await Ledger.aggregate([
        {
            $match : {
                account : this._id
            }
        },
        {
            $group : {
                $_id : null,
                totalDebit : {
                    $sum : {
                        $cond :[
                            {$eq : ["$type" , "DEBIT"]},
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit : {
                    $sum : {
                        $cond : [
                            {$eq : ["$type" , "CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
                }   
            }
        },
        {
            $project : {
                _id : 0,
                balance: { $subtract : [ "$totalCredit" , "$totalDebit"] }
            }
        }
    ])

    if(balanceData.length === 0){
        return 0;
    }

    return balanceData[0].balance;
}

const Account = mongoose.model("Account" , accountSchema);
export default Account;