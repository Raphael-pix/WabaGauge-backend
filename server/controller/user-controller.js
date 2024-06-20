const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../models/Users')
const Meter = require('../models/meters')

// User signup
const signup = async(req,res)=>{
    const { email, room_no,password,confirmPassword } = req.body;

    if(!isValidEmail(email)){
        return res.status(404).json({message:'email is not valid.Please try again'})
    }
    if(password !== confirmPassword){
        return res.status(404).json({message:'passwords do not match'})
    }
    if(!isValidPassword(password)){
        return res.status(404).json({message:passwordReq})
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ 
        email, 
        room_no, 
        password: hashedPassword, 
        role: 'user' 
    });

    try {
        await newUser.save();
    } catch (err) {
        res.status(400).json({message:'unable to create user'});
    }finally{
        return res.status(200).json({newUser})
    }
}

// User login

const login = async(req,res)=>{
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({message:'User not found'});
    }
    try{
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message:'Invalid credentials'});
        const token = jwt.sign({ id: user._id, role: user.role }, 'SECRET_KEY');
        res.status(200).send({ token });
    }catch(err){
        return res.status(404).json({message:'user not found'})
    }
}


//get meter details by id
const getMeterDetails = async (req,res)=>{
    const id =  req.params.id
    try{
        const meter = await Meter.findById(id);
        if(!meter){
            return res.status(404).json({message:'meter not found'})
        }
        return res.status(200).json({meter})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'unable to get meter details'})
    }
}

// Toggle meter status
const toggleMeterStatus = async (req,res)=>{
    const id =req.params.id
    try{
        const meter = await Meter.findById(id);
        if(!meter){
            return res.status(404).json({message:'meter not found'})
        }   
        meter.status = !meter.status;
        await meter.save();
        return res.status(200).json({message:'meter status changed successfully'});
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'unable to change meter status'})
    }
}


// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate password format
function isValidPassword(password) {
    // const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@*#%-$+!])[a-zA-Z\d@*#%-$+!]{8,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])/;
    return passwordRegex.test(password);
}

module.exports = {signup,login,getMeterDetails,toggleMeterStatus}