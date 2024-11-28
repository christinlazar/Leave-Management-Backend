const mongoose = require('mongoose')
const userModel = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    totalLeaves:{
        type:String,
        default:25
    },
    sickLeave:{
        type:String,
        default:0
    },
    casualLeave:{
        type:String,
        default:0
    },
    earnedLeave:{
        type:String,
        default:0
    },
    comment:{
        type:String,
    },
  
})
const User = mongoose.model('User',userModel)
module.exports = User