const User = require("../models/userModel")
const bcrypt = require('bcrypt')
const JWT = require('../utils/jwt')
const signup = async (req,res)=>{
    try {
        const userData = req.body.formData
        const ExistingUser = await User.findOne({email:userData.email})
        if(ExistingUser != null){
            return res.status(409).json({success:false,message:"User already exists"})
        }else{
        const hashedPassword = await bcrypt.hash(userData.password,10)
           userData.password = hashedPassword
            await User.create(userData)
            return res.status(201).json({success:true,message:"User registration completed successfully"})
        }
    } catch (error) {
       return res.status(500).json({serverError:true,error:error.message})
    }
}

const login = async (req,res) =>{
    try {
        const userData = req.body.formData
        const existingUser = await User.findOne({email:userData.email})
        if(existingUser == null){
            return res.status(404).json({success:false,registered:false})
        }
        const isPasswordCorrect = await bcrypt.compare(userData.password,existingUser.password)
        if(isPasswordCorrect){
            const accessToken = await JWT.createJwt(existingUser._id)
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
            });
            return res.status(200).json({success:true,accessToken})
        }else{
            return res.status(401).json({success:false,password:false})
        }
    } catch (error) {
        return res.status(500).json({serverError:true,error:error.message})
    }
}

const getLeaveData = async(req,res)=>{
    try {
        const userId  = req.userId
        const user = await User.findOne({_id:userId})
        return res.status(200).json({success:true,userData:user})
    } catch (error) {
        return res.status(500).json({serverError:true,error:error.message})
    }
}

const submitLeaveData = async (req,res)=>{
    try {
        const {LeaveData} = req.body
        const userId = req.userId
        const start = new Date(LeaveData.startDate);
        const end = new Date(LeaveData.endDate);
        const diffInMs = end - start;
        const totalDays = diffInMs / (1000 * 60 * 60 * 24);
        const userData = await User.findOne({_id:userId})
        const totalLeaves = totalDays + parseInt(userData.sickLeave) + parseInt(userData.earnedLeave) + parseInt(userData.casualLeave)
        if(totalLeaves > 25){
            return res.json({success:false,exceededNumberOfDays:true})
        }else{
        const restrictedDates = [];
        let currentDate = start;
        while (currentDate <= end) {
            restrictedDates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
            if(LeaveData.leaveType == 'sick'){
                const leavesToadd = parseInt(totalDays) + parseInt(userData.sickLeave)
                await User.findOneAndUpdate(
                    {_id:userId},
                    {$set:
                        {
                            sickLeave:leavesToadd,comment:LeaveData.comment
                        },
                        $addToSet: {
                            restrictedDates: { $each: restrictedDates }
                        }

                    })
            }else if(LeaveData.leaveType == 'casual'){
                const leavesToadd = parseInt(totalDays) + parseInt(userData.casualLeave)
                await User.findOneAndUpdate(
                    {_id:userId},
                    {$set:
                        {
                            casualLeave:leavesToadd,comment:LeaveData.comment
                        },
                        $addToSet: {
                            restrictedDates: { $each: restrictedDates }
                        }
                    })
            }else if(LeaveData.leaveType == 'earned'){
                const leavesToadd = parseInt(totalDays) + parseInt(userData.earnedLeave)
                await User.findOneAndUpdate(
                    {_id:userId},
                    {$set:
                        {
                            earnedLeave:leavesToadd,comment:LeaveData.comment
                        },
                        $addToSet: {
                            restrictedDates: { $each: restrictedDates }
                        }
                    })
            }
        }
        return res.status(200).json({success:true})
    } catch (error) {
        return res.status(500).json({serverError:true,error:error.message})
    }
}

const fetchRestrictedDates = async (req,res)=>{
    try {
        const userID = req.userId
        const userData = await User.findOne({_id:userID})
        return res.json({restrictedDates:userData.restrictedDates})
    } catch (error) {
        return res.status(500).json({serverError:true,error:error.message})
    }
}

module.exports = {signup,login,getLeaveData,submitLeaveData,fetchRestrictedDates}