
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
        res.status(201).json({
            message : "Student Found",
            student : {
                studentId:req.user._id,
                name:student.name,ß
                //email:student.email,
                //analytics: analytics


            }
        })
    }catch(err){
        res.status(500).json({message:err.message})
    }
})

export default analyticsRouter


// Calculate student analytics from multiple collections
// Returns object with total, completed, current, missed shifts and attendance rate

// Count total shifts claimed by this student
// Includes all shifts regardless of status

// Count completed shifts (status: "completed")
// These are shifts that the student has finished

// Count currently claimed shifts (status: "claimed")
// These are shifts the student is currently assigned to

// Count shifts given away to other students (status: "transferred")
// These are shifts the student transferred to someone else

// Count missed shifts from attendance records (status: "absent")
// These are shifts where the student was marked as absent

// Calculate attendance rate percentage
// Formula: (present shifts / total attendance records) * 100