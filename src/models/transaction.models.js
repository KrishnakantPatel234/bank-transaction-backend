import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    fromAccount : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Account",
        required : [true , "Transaction must be associated with a from account"],
        index : true
    },
    toAccount : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Account",
        required : [true , "Transaction must be associated with a To account"],
        index : true
    },
    status : {
        type : String,
        enum :{
            values :  ["PENDING" , "COMPLETE" , "FAILED" , "REVERSED"],
            message : "status can be either PENDING , COMPLETE , FAILED or REVERSED "
        },
        default : "PENDING"
    },
    amount : {
        type : Number,
        required : [true , "Amount is required for creating a transaction"],
        min : [0 , "Transaction ammount cannot be negative"]
    },
    idempotencyKey : {
        type : String,
        required : [true , "Idempotency key is required for creating a transaction"],
        index : true,
        unique : true,
    }
}, {
    timestamps : true
})