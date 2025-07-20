
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import User from '../models/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({path:path.join(__dirname,'jwt.env')});
console.log(process.env.JWT_KEY)

router.post('/register',async (req,res) =>{
    try{
        const hashedUser = await bcrypt.hash(req.body.password,10)
        const user = await User.create({
            name : req.body.name,
            email : req.body.email,
            password: hashedUser,
            role : req.body.role,
        })
        console.log("Registerd Succesfully")
        res.status(201).json({message: `Welcome ${user.name} to GustieGo!`,user})
    }catch(err){
        res.status(500).json({message: `Problem With adding account:${err.message}` })
    }
})
router.post('/login',async (req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email})
        if(!user){
            res.status(400).json({message:"invalid email try again"})
        }
        const password = bcrypt.compare(req.body.password,user.password)
        if(!password){
            res.status(400).json({message: "Invalid Password Try again"})
        }
        const token = jwt.sign(
            {id : user._id},
            process.env.JWT_KEY,
            {'expiresIn':'30d'}
        )
        res.json({
            id : user._id,
            email : user.email,
            token : token,
        })
        console.log("Signed In to Gustie Go")
    }catch(err){
        console.log(err)
        res.status(500).json({"message":err.message})
    }
})
export default router