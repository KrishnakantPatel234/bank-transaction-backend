import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : [true, "email is required"],
        trim : true,
        lowercase : true,
        // search for email regex for thematching syntax of email
        match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , "Invalid email address" ],
        unique : [true , "User already exists please log in"]
    },
    name : {
        type : String,
        required : [true, "name is required"],
        trim : true
    },
    password : {
        type : String,
        required : [true, "password is required"],
        trim : true,
        minlength : [6 , "password should contain more than 6 characters"],
        select : false
    },
    systemUser : {
        type : Boolean,
        default : false,
        immutable : true,
        select : false
    }
},{
    timestamps : true
})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    let hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    return;
});

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password , this.password);
}

const User = mongoose.model("User" , userSchema);

export default User;