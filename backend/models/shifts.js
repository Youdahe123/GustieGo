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
        enum :['active','inactive','completed']
    },   
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'users' // active inactive completed
    },
    weekOf :{
        type : Date,
        required : false,
    },
    notes : {
        type: String,
        required:false
    }
}, {timestamps:true});
ShiftsSchema.pre('save',function(next){
    if(!this.weekOf){
        const today = new Date()
        const day = today.getDay() // 0 (Sun) - 6 (Sat)
        // Calculate how many days to subtract to get to Monday
        const diff = today.getDate() - day + (day === 0 ? -6 : 1)
        const monday = new Date(today.setDate(diff))
        // Set time to midnight for consistency
        monday.setHours(0, 0, 0, 0)
        this.weekOf = monday
    }
    next()
})
const Shift = mongoose.model('shifts',ShiftsSchema)
export default Shift

// added max workers current workers isrecurring and assigned students