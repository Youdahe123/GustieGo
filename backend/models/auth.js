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
    isInternational : Boolean,
    Date: {
        type : Date,
        default : Date.now()
    }
})

const User = mongoose.model('users',userSchema)
export default User
// Think about using a reference array
// add interntaional and removed the shifts and missed count