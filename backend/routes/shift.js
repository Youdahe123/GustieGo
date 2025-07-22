
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
Shiftrouter.put('/claimShift',requireAuth,async (req,res) =>{
    try{
        const {shiftId} = req.body
        const shift = await Shift.findOne({_id:shiftId,isTaken:false})
        const person = await User.findById(req.user._id)
        if (!shift){
            return res.status(400).json({message:"Shift has been taken or not avaliable"})
        }
        shift.isTaken = true
        shift.assignedTo = req.user._id
        person.attendedCount += 1
        await person.save()
        await shift.save()
        res.status(200).json({message:"Shift has been claimed"})
        console.log("Shift Claimed!")
    }catch(err){
        res.status(500).json({message:err.message})
    }
})
Shiftrouter.put('/giveAway',requireAuth,async(req,res) =>{
    try{
        const {shiftId,reciverId} = req.body
        const personGivingAway = await User.findById(req.user._id)
        const personTaking = await User.findById(reciverId)
        const shift = await Shift.findById(shiftId)
        
        shift.assignedTo = reciverId
        personGivingAway.attendedCount -= 1
        personTaking.attendedCount += 1
        await personTaking.save()
        await personGivingAway.save()
        await shift.save()
        res.status(200).json({message:"Shift has been given away"})
        console.log("Shift has been Given Away")
    }catch(err){
        res.status(500).json({message:"Err with giving away a shift",err})
    }
})
Shiftrouter.get('/available',requireAuth,async (req,res)=>{
    try {
        const shiftsAvailable = await Shift.find({isTaken:false})
        if(shiftsAvailable.length == 0){
            return res.status(404).json({message:"No Shifts available!"})
        }
        res.status(200).json({message:"Shifts Avalible",shiftsAvailable})
    }catch(err){res.status(500).json({message:err.message})}
})
Shiftrouter.put('/absence',requireAuth,async (req,res) =>{
    try{
        const {shiftId} = req.body
        const shiftAbsent = await Shift.findById(shiftId)
        const student = await User.findById(req.user._id)
        student.missedCount += 1
        shiftAbsent.isTaken = false
        shiftAbsent.assignedTo = null
        await  student.save()
        await shiftAbsent.save()
        res.status(200).json({message:"User has been marked absent successfully"})
    }catch(err){
        res.status(500).json({message:err.message})
    }
})


export default Shiftrouter