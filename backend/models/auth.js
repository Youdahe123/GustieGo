import mongoose from 'mongoose'

export const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    username : {
        type:String,
        unique : true,
        required :true,
    },
    role : {
        type : String,
        enum : ['Student','Admin'],
        required : true
    },
    missedCount : {
        type:Number,
        default : 0
    },
    givenAwayCount : {
        type:Number,
        default : 0
    },
    shifts :[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'shifts'
    }],
    Date: {
        type : Date,
        default : Date.now()
    }
})

const User = mongoose.model('users',userSchema)
export default User
// Think about using a reference array