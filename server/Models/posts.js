import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title:String,
    message:String,
    tags:[String],
    likes:[String],
    createdAt:String,
    selectedFile:String,
    creatorId:String,
    creatorName:String,
    comments:[],
});
const postModel = mongoose.model('post', postSchema);
export default postModel;