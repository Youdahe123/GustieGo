import mongoose from "mongoose";

export const ShiftsSchema = new mongoose.Schema({
    location: String,
    Time : String, // Monday Tuesday Wednsday etc
    hoursPerShift : {
        type: Number,
        required:true
    },
    maxWorkers : Number,
    currentWorkers : {
        type:Number,
        default:0
    },
    assignedStudents: [{
        type: mongoose.Schema.Types.ObjectId, // array of student names
        ref: 'users'
    }],
    isRecurring:Boolean,
    recurringPattern : String, // weekly biweekly etc
    dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    status : String,
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    notes : {
        type: String,
        required:false
    }
}, {timestamps:true});

const Shift = mongoose.model('shifts',ShiftsSchema)
export default Shift

// added max workers current workers isrecurring and assigned students