import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from 'dotenv';
dotenv.config()

import postRoutes from "./Routes/posts.js"
import authRoutes from "./Routes/auth.js"


const app = express();



app.use(express.json());
app.use(cors({
    origin:'https://memorybank-c90e1.web.app',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}));


app.use("/posts",postRoutes);
app.use("/auth",authRoutes);


const CONNECTION_URL = process.env.DATABASE_URI ;
const PORT = process.env.PORT || 5000;

//connecting to database
mongoose.connect(CONNECTION_URL)
.then(()=>{
    app.listen(PORT,()=>{console.log(`server running on port:${PORT}`)})
})
.catch((error)=>{
    console.log(error.message)
})