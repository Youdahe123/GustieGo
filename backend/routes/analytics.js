
import express from 'express';
import User from '../models/auth.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {requireAdmin,requireAuth} from '../middleware/adminAuth.js';


const analyticsRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

analyticsRouter.get('/student/:id',requireAdmin ,async (req,res) =>{
    try{

        const student = await User.findById(req.params.id)
        if(!student){
            res.json(404).json({message:"Coudld not find student"})
        }
        res.status(200).json({message:"Student Found",student})
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

export default analyticsRouter