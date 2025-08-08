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
        const {startTime,endTime}  = req.body
        const shift = await Shift.create({
            location: req.body.location,
            dayOfWeek: req.body.dayOfWeek,
            startTime:startTime,
            endTime:endTime,
            hoursPerShift : req.body.hoursPerShift,
            maxWorkers : req.body.maxWorkers,
            currentWorkers : 0,
            assignedStudents : [],
            studentDetails : [],
            isRecurring : req.body.isRecurring,
            recurringPattern : req.body.recurringPattern,
            status : 'active',
            notes : req.body.notes
        })
        const updatedShift = await Shift.findById(shift._id)
        res.status(201).json({message:"Shift has been created",shift: updatedShift})
        console.log("Shift has been created!")
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
        if(shift.currentWorkers === shift.maxWorkers){
            return res.status(500).json({message:'current Shift is full'})
        }
        shift.assignedStudents.push(req.user._id)
        shift.currentWorkers += 1

         shift.studentDetails.push({
            studentId : req.user._id,
            claimedAt : Date.now(),
            status : 'claimed'
        })
        await shift.save()
        res.status(201).json(
            {message:"Shift has been claimed",
            shift : {
                id : req.body.shiftId,
                currentWorkers: shift.currentWorkers,
                assignedStudents : shift.assignedStudents,
                studentDetails : shift.studentDetails
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
            return res.status(404).json({message:"User doesnt Exist!"})
        }
        shift.assignedStudents.push(targetId._id)
        shift.studentDetails.push({
            studentId:targetId._id,
            claimedAt : Date.now(),
            status:'claimed'
        })
        const studentDetail = shift.studentDetails.find(
            details => details.studentId.toString() === req.user._id.toString()
        )
        if(studentDetail){
            studentDetail.status = 'transferred'
            studentDetail.transferredTo = targetId._id
            studentDetail.transferredAt = Date.now()
            await shift.save()
        }else{
           return res.status(404).json({message:"Cannot Find Users"})
        }

        await shift.save()
        res.status(200).json({
            message: "Shift has been given away",
            shift: {
                id: shift._id,
                location: shift.location,
                dayOfWeek: shift.dayOfWeek,
                Time:shift.Time,
                assignedStudents: shift.assignedStudents,
                studentDetails: shift.studentDetails,
                currentWorkers: shift.currentWorkers,
                maxWorkers: shift.maxWorkers,
                status: shift.status
            },
            from: req.user.username, // or req.user._id
            to: targetId.username    // or targetId._id
        });
        console.log("Shift has been Given Away")
    }catch(err){
        res.status(500).json({message:"Err with giving away a shift",err})
    }
})
Shiftrouter.get('/available',requireAuth,async (req,res)=>{
    try {
        const {location} = req.query
        const filter = {
            status: 'active',
            $expr: { $lt: ["$currentWorkers", "$maxWorkers"] } // only shifts less than the max
        };
        if (location) filter.location = location;
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
Shiftrouter.put('/absence', requireAuth, async (req, res) => {
    try {
        const { shiftId } = req.body;
        const userId = req.user._id;
        const shiftAbsence = await Shift.findById(shiftId);
        shiftAbsence.assignedStudents = shiftAbsence.assignedStudents.filter(
            id => id.toString() !== userId.toString()
        );
        shiftAbsence.currentWorkers -= 1;
        const studentAbsenceDetail = shiftAbsence.studentDetails.find(
            details => details.studentId.toString() === userId.toString()
        );
        if (studentAbsenceDetail) {
            studentAbsenceDetail.status = 'absent';
        } else {
            return res.status(404).json({ message: "User not Found" });
        }
        await shiftAbsence.save();
        res.status(200).json({
            message: "User has been marked absent successfully",
            shift: shiftAbsence
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

Shiftrouter.delete('/delete',requireAdmin,async (req,res) =>{
    const shiftId = req.body
    const shiftToRemove = await Shift.findById(shiftId)
    if (!shiftToRemove){
        return res.status(404).json({message:"Shift cannot be found"})
    }
    await Shift.deleteOne({_id : shiftId})
    return res.status(200).json({message:"Shift Deleted"})

})
// note for later change it to keep track of shiftid when claiming a shift so a user cannot just take a shift then when marked absent it wont decrement the shift
// for example if im working at Caf and i need to miss a shift i should delete it and it will trigger the give away shift the shiftId is the id of the shift we clicked on
// and the reciver id is the thing we put if we want to just mark absent we click mark absent and that should remove THAT specific shift count like if thats the shift that we 
// had selected before not just any shift minus one but specific shifts
//add edge cases for one time take for giveaway

export default Shiftrouter

// ==========================================
// 🚀 GustieGo API TODO List - SHIFT ROUTES
// ==========================================

// 📋 AUTHENTICATION ROUTES TO IMPLEMENT
// POST /auth/register
//    - Validate email format and uniqueness
//    - Hash password using bcrypt
//    - Create new user document in MongoDB
//    - Return JWT token for immediate login
//    - Handle role validation (Student/Admin)

// POST /auth/login
//    - Find user by email
//    - Verify password with bcrypt
//    - Generate JWT token
//    - Return user data and token

// 🕒 SHIFT MANAGEMENT ROUTES TO IMPLEMENT
// POST /makeShift
//    - Verify admin role via JWT
//    - Validate shift data (location, time, max workers)
//    - Create shift document in MongoDB
//    - Handle recurring shift logic
//    - Set status to "active"

// PUT /claimShift
//    - Verify student role via JWT
//    - Check if shift exists and is available
//    - Verify shift isn't full (currentWorkers < maxWorkers)
//    - Add student to assignedStudents array
//    - Increment currentWorkers count
//    - Add student details to studentDetails array

// PUT /giveAway
//    - Verify current student owns the shift
//    - Find target student by username/email
//    - Remove current student from assignedStudents
//    - Add target student to assignedStudents
//    - Update studentDetails array
//    - Update status to "transferred"

// GET /available
//    - Query shifts with status "active"
//    - Filter by currentWorkers < maxWorkers
//    - Optionally include student details for admin view
//    - Sort by day and time

// PUT /absence
//    - Verify student owns shift or admin role
//    - Update student status to "absent" in studentDetails
//    - Optionally remove from assignedStudents array
//    - Decrement currentWorkers count
//    - Update shift status if needed

// 📊 ANALYTICS ROUTES TO IMPLEMENT
// GET /analytics/student/:id
//    - Verify admin role via JWT
//    - Find student by ID/username
//    - Aggregate weekly data from WeeklyAnalytics collection
//    - Get current claimed shifts
//    - Calculate total hours worked
//    - Return comprehensive analytics

// 🔄 WEEKLY RESET SYSTEM (BACKGROUND JOB)
// Scheduled Reset Process
//    - Set up cron job to run every hour
//    - Check if it's Sunday 11 PM
//    - Aggregate all shift data for the week
//    - Store in WeeklyAnalytics collection
//    - Clear assignedStudents and studentDetails arrays
//    - Reset currentWorkers to 0
//    - Keep shift templates intact for recurring shifts

// 🗄️ DATABASE MODELS NEEDED
// User Model
//    - name, email, password, username fields
//    - role enum (Student/Admin)
//    - isInternational boolean
//    - date timestamp

// Shift Model
//    - location, timeSlot, hoursPerShift, maxWorkers fields
//    - currentWorkers counter
//    - assignedStudents array (ObjectId references)
//    - studentDetails array with status tracking
//    - isRecurring, recurringPattern, dayOfWeek fields
//    - status enum (active/inactive/completed)
//    - createdBy reference, notes field
//    - weekOf date for tracking cycles

// WeeklyAnalytics Model
//    - studentId reference
//    - weekOf date
//    - completedShifts, absentShifts, transferredShifts counters
//    - totalHours field

// SystemConfig Model
//    - key-value pairs for system settings
//    - date timestamp

// 🔧 SHIFT SCHEMA PRE-SAVE LOGIC
// ShiftsSchema.pre('save', function(next) {
//    if (!this.weekOf) {
//        const today = new Date()
//        const day = today.getDay()
//        const diff = today.getDate() - day + (day === 0 ? -6 : 1)
//        this.weekOf = new Date(today.setDate(diff))
//    }
//    next()
// })
// This automatically calculates the week start date for each shift
