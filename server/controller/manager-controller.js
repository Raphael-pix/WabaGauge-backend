const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Users')
const Meter = require('../models/meters')

// Manager signup

const signup = async (req,res)=>{
    const { email, password } = req.body;

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
    const newManager = new User({ 
        email, 
        password: hashedPassword, 
        role: 'manager' 
    });
    try {
        await newManager.save();
        res.status(201).send('Manager created');
    } catch (err) {
        res.status(400).json({message:'unable to create user'});
    }finally{
        return res.status(200).json({newManager})
    }
}

// Manager login

const login = async(req,res)=>{
    const { email, password } = req.body;

    const manager = await User.findOne({ email });

    if (!manager) {
        return res.status(400).json({message:'Manager not found'});
    }
    try{
        const isMatch = await bcrypt.compare(password, manager.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');
        const token = jwt.sign({ id: manager._id, role: manager.role }, 'SECRET_KEY');
        return res.status(200).send({ token });
    }catch(err){
        return res.status(404).json({message:'user not found'})
    }
}



// Get all meters
const getAllMeters = async (req,res)=>{
    let meters
    try{
        meters = await Meter.find();
    }catch(err){
        console.log(e)
    }
    if(!meters){
        return res.status(404).json({message:'no meters found'})
    }
    return res.status(200).json({meters});
}


// Get meter details by room number
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
const toggleMeterStatus = async(req,res)=>{
    const id =  req.params.id
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


//lock meter
const lockMeter = async(req,res)=>{
    const id =  req.params.id
    try{
        const meter = await Meter.findById(id);
        if(!meter){
            return res.status(404).json({message:'meter not found'})
        }   
        meter.status = !meter.status;
        await meter.save();
        return res.status(200).json({message:`meter ${meter.status === true ? 'locked' : 'unlocked'}`});
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'unable to change meter'})
    }
}


module.exports = {signup,login,getAllMeters,getMeterDetails,toggleMeterStatus,lockMeter}
