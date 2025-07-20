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
    Date: {
        type : Date,
        default : Date.now()
    }
})

const User = mongoose.model('users',userSchema)
export default User