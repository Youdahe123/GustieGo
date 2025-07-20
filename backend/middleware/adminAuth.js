import User from "../models/auth.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../routes/jwt.env') });


async function requireAdmin (req,res,next){
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({message:"No token Provided"})
        const decoded = jwt.verify(token,process.env.JWT_KEY)
        const user = await User.findById(decoded.id);
        if (!user || user.role != "Admin") {
            return res.status(401).json({message:"Access Denied Admin Only"});
        }
        req.user = user
        next()
    }catch(err){
        res.status(401).json({message:"Invalid Token"})
    }
}

async function requireAuth(req,res,next){
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({message:"No token Provided"})
        const decoded = jwt.verify(token,process.env.JWT_KEY)
    const user = await User.findById(decoded.id)
    if (!user){
        return res.status(401).json({message:"Invalid Token"})
    }
    req.user = user
    next()
    }catch(err){
        res.status(401).json({message:"Authorization Failed"})
    }
}
export {requireAdmin,requireAuth}