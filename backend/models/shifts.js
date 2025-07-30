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
    studentDetails: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        claimedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['claimed', 'completed', 'cancelled', 'absent', 'transferred'],
            default: 'claimed'
        },
        notes: {
            type: String
        },
        transferredTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: false
        },
        transferredAt: {
            type: Date,
            required: false
        }
    }],
    transferredTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    isRecurring:Boolean,
    recurringPattern : String, // weekly biweekly etc
    dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    claimedAt : {
        type:Date,
        default:Date.now()
    },
    status :{
        type:String,
        enum :['claimed', 'completed', 'cancelled', 'absent', 'transferred'],
    },   
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'users' // active inactive completed
    },
    weekOf :{
        type : Date,
        required : true,
    },
    notes : {
        type: String,
        required:false
    }
}, {timestamps:true});
ShiftsSchema.pre('save',function(next){
    if(!this.weekOf){
        const today = new Date()
        const day = today.getDay()
        const diff = today.getDate - day + (day === 0 ? -6 : 1)
        this.weekOf = newDate(today.setDate(diff))
    }
    next()
}),
ShiftsSchema.pre('save',function(next){
    const today = new Date()
    const day = today.getDay()
    if(day % 7 != 6){

    } 
}),

const Shift = mongoose.model('shifts',ShiftsSchema)
export default Shift

// added max workers current workers isrecurring and assigned students