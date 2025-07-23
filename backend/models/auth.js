import mongoose from 'mongoose'

export const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    role : {
        type : String,
        enum : ['Student','Admin'],
        required : true
    },
    attendedCount : {
        type:Number,
        default : 0
    },
    missedCount : {
        type:Number,
        default : 0
    },
    givenAwayCount : {
        type:Number,
        default : 0
    },
    Date: {
        type : Date,
        default : Date.now()
    }
})

const User = mongoose.model('users',userSchema)
export default User
// Think about using a reference array