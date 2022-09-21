import userModel from "../Models/users.js"
import bcrypt from "bcrypt"
import validator from "email-validator"
import jwt from "jsonwebtoken"
import * as dotenv from 'dotenv';
dotenv.config()

export const registerUsers = async (req,res)=>{
    const {firstName,lastName,emailAddress,password,repeatPassword} = req.body;
    
    //if user leaves any field empty raise an error
    if(!firstName || !lastName || !emailAddress || !password || !repeatPassword){
        return res.status(400).json({message:"you left one or more fields empty,make sure to populate every field😞"})
    }
    //check if user with that email already exists
    const foundUser = await userModel.findOne({emailAddress:emailAddress });
    
    if(foundUser) return res.status(400).json({message:"a user with that email already exists,please choose another email😃"});
    
    //validate the provided email
    const emailIsValid = validator.validate(emailAddress)

    if(!emailIsValid) return res.status(400).json({message:"hmmm.. the email you provided doesn't look right🤔,please try again"})
    //check if both password fields match
    if (password !== repeatPassword) return res.status(400).json({message:"the passwords you entered don't match,please try again😞"});

    //hash users password
    const hashedPassword = await bcrypt.hash(password,10);
    //save user to database and get back the user
    const user = await userModel.create({firstName:firstName,lastName:lastName,emailAddress:emailAddress,password:hashedPassword});

    //generate jwt token for the user and send to client
    const token = await jwt.sign({email:user.email,id:user._id },process.env.JWT_SECRET,{expiresIn:"24h"});

    res.status(200).json({user,token})
}

export const loginUsers = async (req,res)=>{
    const {emailAddress,password} = req.body;
    //if user submits empty fields
    if (!emailAddress || !password) return res.status(400).json({message:"you have left one or more fields empty,please populate all fields😞"})
    //validate the email
    const emailIsValid = validator.validate(emailAddress)
    if(!emailIsValid) return res.status(400).json({message:"hmmm.... the email you provided doesn't look right🤔,please try again"})
    //check if the user exists
    const user = await userModel.findOne({ emailAddress: emailAddress });

    if(!user) return res.status(404).json({message:"no user with that email was found,please signUp instead😃"})

    //check if a hashed password field exists for this user if no hash password
    //then the user signs in with oAuth
    if(!user.password) return res.status(404).json({message:"that's not the correct way to access this account,this account uses google to login,simply tap the google button below,login to your google account and we will grant you access😉"})
    //check if password is correct
    const correctPassword = await bcrypt.compare(password,user.password);

    if(!correctPassword) return res.status(401).json({message:"uh oh😐!,your password is incorrect,please double check and try again"})

    //generate token for the user and send to client
    const token = await jwt.sign({email:user.email,id:user._id },process.env.JWT_SECRET,{expiresIn:"24h"});

    res.status(200).json({user,token})
}

export const googleLogin = async(req,res)=>{
    const {givenName:firstName,familyName:lastName,email,googleId} = req.body;
    //when the user closes the google popup window don't proceed
    if(!firstName || !lastName || !email || !googleId ) return res.status(400).json({proceed:false,message:"user closed the popup window"})
    //check if the google email for user exists and save to db if it doesn't exist
    const user = await userModel.findOne({ emailAddress:email });
    if(!user){
        await userModel.create({firstName:firstName,lastName:lastName,emailAddress:email,googleId:googleId});
        res.status(200).json({proceed:true,message:"new user created in db using google oAuth"})
    }else{
        res.status(200).json({proceed:true,message:"google oAuth user already exists in db and can proceed"})
    }
}