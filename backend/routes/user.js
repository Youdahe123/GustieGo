
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
        const dbCheck = await User.findOne({email:req.body.email})
        if (dbCheck){
            return res.status(400).json({message:"email already exists"})
        }
        const user = await User.create({
            name : req.body.name,
            username :req.body.username,
            email : req.body.email,
            password: hashedUser,
            role : req.body.role,
            isInternational:req.body.isInternational,
            isActive :req.body.isActive,
            lastLogin : Date.now()
        })
        console.log("Registerd Succesfully")
        res.status(201).json({message: `Welcome ${user.name} to GustieGo!`,user})
    }catch(err){
        res.status(500).json({message: `Problem With adding account:${err.message}` })
    }
})
router.post('/login',async (req,res)=>{
    try{
        const user = await User.findOne({username:req.body.username})
        if(!user){
            res.status(400).json({message:"invalid username try again"})
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
            role : user.role,
            username : user.username,
            token : token,
        })
        console.log("Signed In to Gustie Go")
    }catch(err){
        console.log(err)
        res.status(500).json({"message":err.message})
    }
})
export default router

// ==========================================
// 🚀 GustieGo API TODO List - USER ROUTES
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