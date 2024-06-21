const express = require('express')
const managerRouter = express.Router()
const authenticateManager = require('../middleware/authenticateManger')

const {signup,login,getAllMeters,getMeterDetails,toggleMeterStatus,lockMeter} = require('../controller/manager-controller')

managerRouter.get('/',authenticateManager,getAllMeters)
managerRouter.post('/create-account',signup)
managerRouter.post('/login',login)
managerRouter.get('/room-details/:id',authenticateManager,getMeterDetails)
managerRouter.put('/room-details/toggle-meterstatus/:id',authenticateManager,toggleMeterStatus)
managerRouter.put('/room-details/lock-meter/:id',authenticateManager,lockMeter)

module.exports = managerRouter