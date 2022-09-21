import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    firstName:String,
    lastName:String,
    emailAddress:String,
    password:String,
    googleId:String,

})

const userModel = mongoose.model("user",userSchema);

export default userModel;