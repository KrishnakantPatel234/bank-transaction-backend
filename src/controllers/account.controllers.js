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

export {
    createAccount
}