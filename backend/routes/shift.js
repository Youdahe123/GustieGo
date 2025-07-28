
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
            location: req.body.location,
            dayOfWeek: req.body.dayOfWeek,
            timeSlot : req.body.timeSlot,
            hoursPerShift : req.body.hoursPerShift,
            maxWorkers : req.body.maxWorkers,
            currentWorkers : 0,
            assignedStudents : [],
            isRecurring : req.body.isRecurring,
            recurringPattern : req.body.recurringPattern,
            status : 'active',
            notes : req.body.notes
        })
        res.status(201).json({message:'Shift Has been created',shift})
        console.log("Shift Created!")
        
    }catch(err){
        res.status(500).json({message:err.message})
    }
})
Shiftrouter.put('/claimShift',requireAuth,async (req,res) =>{
    try{
        const shift = await Shift.findById(req.body.shiftId)
        if(!shift){
            res.status(404).json({message:'Shift Not found'})
        }
        shift.assignedStudents.push(req.user._id)
        shift.currentWorkers += 1
        await shift.save()
        res.status(201).json(
            {message:"Shift has been claimed",
            shift : {
                id : req.body.shiftId,
                currentWorkers: shift.currentWorkers,
                assignedStudents : shift.assignedStudents
            }
            
            })
    }catch(err){
        res.status(500).json({message:"Unable to claim shift", error: err.message})
    }
})
Shiftrouter.put('/giveAway',requireAuth,async(req,res) =>{
    try{
        const {shiftId,targetStudentUsername} = req.body
        const shift = await Shift.findById(shiftId)
        shift.assignedStudents = shift.assignedStudents.filter( // removes old user from assigned db
            id => id.toString() !== req.user._id.toString()
        )
        const targetId = await User.findOne({username : targetStudentUsername})
        if(!targetId){
            res.status(404).json({message:"User doesnt Exist!"})
        }
        await shift.assignedStudents.push(targetId._id)
        await shift.save()
        res.status(200).json({message:"Shift has been given away"})
        console.log("Shift has been Given Away")
    }catch(err){
        res.status(500).json({message:"Err with giving away a shift",err})
    }
})
Shiftrouter.get('/available',requireAuth,async (req,res)=>{
    try {
        const {location} = req.query
        const filter = {status:'active'}
        if (location) filter.location = location
        const locationShift = await Shift.find(filter)   
        if(locationShift.length === 0){
            return res.status(404).json({message:"No Shifts Found"})
        }     
        res.status(200).json({
            message : "Success",
            shifts: locationShift
        })
    }catch(err){res.status(500).json({message:err.message})}
})
Shiftrouter.put('/absence',requireAuth,async (req,res) =>{
    try{
        const {shiftId} = req.body
        const userId = req.user_.id
        const shiftAbsence = await Shift.findById(shiftId)
        shiftAbsence.assignedStudents = shiftAbsence.assignedStudents.filter(
            id => id.toString() !== userId.toString()
        )
        
        res.status(200).json({message:"User has been marked absent successfully"})
    }catch(err){
        res.status(500).json({message:err.message})
    }
})
// note for later change it to keep track of shiftid when claiming a shift so a user cannot just take a shift then when marked absent it wont decrement the shift
// for example if im working at Caf and i need to miss a shift i should delete it and it will trigger the give away shift the shiftId is the id of the shift we clicked on
// and the reciver id is the thing we put if we want to just mark absent we click mark absent and that should remove THAT specific shift count like if thats the shift that we 
// had selected before not just any shift minus one but specific shifts
//add edge cases for one time take for giveaway

export default Shiftrouter
