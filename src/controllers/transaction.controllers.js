import mongoose from "mongoose";
import Ledger from "../models/ledger.models.js";
import Transaction from "../models/transaction.models.js";
import Account from "../models/account.models.js";
import {sendTransactionEmail , sendTransactionFailureEmail} from "../services/email.service.js";
import User from "../models/user.models.js";

/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW
    * 1. Validate Request
    * 2. Validate idempotency key
    * 3. Check account status
    * 4. Derive sender balance from ledger
    * 5. Create transaction(PENDING)
    * 6. Create DEBIT ledger entry
    * 7. Create CREDIT ledger entry
    * 8. Mark transaction COMPLETED
    * 9. Commit MongoDB session
    * 10. Send email notification 
 */

async function createTransaction(req , res){
    /**
     * 1. Validate request
     */
    const {fromAccount , toAccount , amount , idempotencyKey} = req.body;

    if( !fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message : "fromAccount , toAccount , amount , idempotencyKey are required"
        })
    }

    const fromUserAccount = await Account.findOne({_id : fromAccount});

    const toUserAccount = await Account.findOne({_id : toAccount});

    if( !fromUserAccount || !toUserAccount ){
        return res.status(400).json({
            message : "invalid fromAccount or toAccount"
        })
    }

    /**
     * 2. Validate idempotency Key
     */
    const isTransactionAlreadyExists = await Transaction.findOne({
        idempotencyKey : idempotencyKey
    })

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status === "COMPLETED"){
            return res.status(200).json({
                message : "Transaction Already Processed",
                transaction : isTransactionAlreadyExists
            })
        }
        if(isTransactionAlreadyExists.status === "PENDING"){
            return res.status(200).json({
                message : "Transaction is still processing"
            })
        }
        if(isTransactionAlreadyExists.status === "FAILED"){
            return res.status(500  ).json({
                message : "Transaction processing failed previously , please retry"
            })
        }
        if(isTransactionAlreadyExists.status === "REVERSED"){
            return res.status(500).json({
                message : "Transaction is reversed , please retry",
            })
        }   
    }

    /**
     * 3. Check account status
     */
    if( fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
            message : "Both fromAccount and toAccount must be ACTIVE to process transaction"
        })
    }

    /**
     * 4. Derive sender balance from ledger
     */
    const balance = await fromUserAccount.getBalance();
    
    if(balance < amount){
        return res.status(400).json({
            message : `Insufficient Balance. Current Balance is ${balance} and requested amount is ${amount}`
        })
    }

    let transaction;

    try{
        /**
         * 5. Create transaction (PENDING)
         */
        const session = await mongoose.startSession();
        session.startTransaction();

        transaction = new Transaction({
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        });

        await transaction.save({ session });

        const debitLedgerEntry = await Ledger.create([{
            account : fromAccount,
            amount : amount,
            transaction : transaction._id,
            type : "DEBIT"
        }] , {session});

        await (() => {
            return new Promise((resolve) => setTimeout(resolve , 15 * 1000));
        })()

        const creditLedgerEntry = await Ledger.create([{
            account : toAccount,
            amount : amount,
            transaction : transaction._id,
            type : "CREDIT"
        }] , {session});

        await Transaction.findByIdAndUpdate(
            transaction._id,
            { status: "COMPLETED" },
            { session }
        );

        await session.commitTransaction()
        session.endSession();
    }
    catch(error){
        return res.status(400).json({
            message : "Transaction is pending due to some issue, please retry after some time"
        })
    }

    /**
     * 10. Send Email notification
     */
    await sendTransactionEmail(req.user.email , req.user.name , amount , toAccount);

    return res.status(201).json({
        message : "Transaction completed successfully",
        transaction : transaction
    })
}

async function createInitialFundsTransaction(req , res){
    const {toAccount , amount , idempotencyKey } = req.body;

    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message : "toAccount , amount and idempotency key are required to initialize a transaction"
        })
    }

    const toUserAccount = await Account.findOne({_id : toAccount});

    if(!toUserAccount){
        return res.status(404).json({
            message : "To User Account is invalid"
        })
    }

    const fromUserAccount = await Account.findOne({
        user : req.user._id
    })
    console.log(fromUserAccount);
    if(!fromUserAccount){
        return res.status(400).json({
            message : "System user account not found"
        })
    }

    const session = await mongoose.startSession();
    session.startTransaction()

    // Not saved in transaction model , it is created on server
    const transaction = new Transaction({
        fromAccount : fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    });

    const debitLedgerEntry = await Ledger.create([{
        account : fromUserAccount._id,
        amount , 
        transaction : transaction._id,
        type : "DEBIT"
    }], { session });

    const creditLedgerEntry = await Ledger.create([{
        account : toUserAccount._id,
        amount ,
        transaction : transaction._id,
        type : "CREDIT"
    }] , {session});

    transaction.status = "COMPLETED";
    await transaction.save({session});

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
        message : "Initial funds transaction completed successfully",
        transaction : transaction
    })

}

export {
    createTransaction,
    createInitialFundsTransaction
}