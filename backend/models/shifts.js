import mongoose from "mongoose";

export const ShiftsSchema = new mongoose.Schema({
    location: String,
    Time : String,
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
    notes : String,
}, {timestamps:true});

const Shift = mongoose.model('shifts',ShiftsSchema)
export default Shift