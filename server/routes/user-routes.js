const express = require('express')
const userRouter = express.Router()
const authenticateUser = require('../middleware/authenticateUser')

const {signup,login,getMeterDetails,toggleMeterStatus} = require('../controller/user-controller')

userRouter.post('/create-account',signup)
userRouter.post('/login',login)
userRouter.get('/:id',authenticateUser,getMeterDetails)
userRouter.put('/:id',authenticateUser,toggleMeterStatus)

module.exports = userRouter