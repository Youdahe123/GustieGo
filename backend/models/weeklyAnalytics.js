import mongoose from "mongoose";

const WeeklyAnalytics = new mongoose.Schema({
    studentId : {
        type : mongoose.Schema.ObjectId,
        ref : 'users'
    },
    weekOf : Date,
    completedShifts : Number,
    absentShifts : Number,
    transferredShifts : Number,
    totalHours : Number
},
{timestamps:true})

const weekStates = mongoose.model('weeklyStats',WeeklyAnalytics)
export default weekStates


// How Automatic Completion Works
// You need a way to know when a shift is “over.”

// This usually means you need a shift end time (not just a day or time slot string).
// You’ll need to store the shift’s start and end times as Date objects or as a time range.
// A scheduled job (cron) runs periodically (e.g., every hour or every night):

// It finds all shifts where the end time has passed and the studentDetails.status is still "claimed".
// It updates those studentDetails.status fields to "completed".
// What You Need to Add
// Store shift end time in your shift model (e.g., startTime and endTime as Date fields).
// Write a script or endpoint that:
// Finds all shifts with end times in the past and uncompleted students.
// Updates their studentDetails.status to "completed".
// Set up a cron job (using node-cron or a similar package) to run this script automatically.