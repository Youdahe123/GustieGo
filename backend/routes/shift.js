
import express from 'express';
import User from '../models/auth.js';
import jwt from 'jsonwebtoken';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import Shift from '../models/shifts.js';
import {requireAdmin,requireAuth} from '../middleware/adminAuth.js';


const Shiftrouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

Shiftrouter.post('/makeShift',requireAdmin,async (req,res) =>{
    try{
        const shift = await Shift.create({
            location : req.body.location,
            Time : req.body.Time,
            dayOfWeek : req.body.dayOfWeek,
            createdBy : req.user._id,
            assignedTo : null,
            notes : req.body.notes,
        })
        res.status(201).json({message:'Shift Has been created',shift})
        console.log("Shift Created!")
    }catch(err){
        res.status(500).json({message:err.message})
    }
})
Shiftrouter.post('/claimShift',requireAuth,async (req,res) =>{
    try{
        const {shiftId} = req.body
        const shift = await Shift.findOne({_id:shiftId,isTaken:false})
        if (!shift){
            res.status(400).json({message:"Shift has been taken or not avaliable"})
        }
        shift.isTaken = true
        shift.assignedTo = req.user._id
        await shift.save()
        res.status(200).json({message:"Shift has been claimed"})
        console.log("Shift Claimed!")
    }catch(err){
        res.status(500).json({message:err.message})
    }
})


export default Shiftrouter