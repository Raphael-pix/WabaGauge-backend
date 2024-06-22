const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Users')
const Meter = require('../models/meters')
const waziCloudService = require('../services/waziCloudService');




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
    const metersInfo = await Promise.all(meters.map(meter => waziCloudService.getDeviceDetails(meter._id)));
    const response = meters.map((meter, index) => ({
        ...meter.toObject(),
        status: metersInfo[index]
      }));
    return res.status(200).json({response});
}


// Get meter details by id
const getMeterDetails = async (req,res)=>{
    const id =  req.params.id
    try{
        const meter = await Meter.findById(id);
        if(!meter){
            return res.status(404).json({message:'meter not found'})
        }
        const meterInfo = await waziCloudService.getDeviceDetails(meter._id);
        return res.status(200).json({meterInfo})
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
        const newStatus = !meter.status;
        await waziCloudService.setDeviceStatus(meter._id, newStatus);
        meter.status = newStatus;
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
