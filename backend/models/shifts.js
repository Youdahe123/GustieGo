import mongoose from "mongoose";

export const ShiftsSchema = new mongoose.Schema({
    location: String,
    Time : String,
    hours : {
        type: Number,
        required:true
    },
    isTaken: {
        type: Boolean,
        default: false
    },
    dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    assignedTo : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users'
    },
    notes : {
        type: String,
        required:false
    }
}, {timestamps:true});

const Shift = mongoose.model('shifts',ShiftsSchema)
export default Shift