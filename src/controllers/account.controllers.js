import Account from "../models/account.models.js";

const createAccount = async (req , res) => {
    const user = req.user;

    const account = await Account.create({
        user : user._id
    });

    res.status(201).json({
        message : "Account created successfully",
        account
    })
}

const getAllAccounts = async (req , res) => {
    const accounts = await Account.find({ user : req.user._id});

    res.status(200).json({
        accounts
    })
}

export {
    createAccount,
    getAllAccounts
}