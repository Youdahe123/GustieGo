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