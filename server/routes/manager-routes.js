const express = require('express')
const managerRouter = express.Router()
const authenticateManager = require('../middleware/authenticateManger')

const {getAllMeters,getMeterDetails,toggleMeterStatus,lockMeter} = require('../controller/manager-controller')
const {signup,login} =  require('../controller/user-controller')

managerRouter.post('/create-account',signup)
managerRouter.post('/login',login)
managerRouter.get('/',authenticateManager,getAllMeters)
managerRouter.get('/room-details/:id',authenticateManager,getMeterDetails)
managerRouter.put('/room-details/toggle-meterstatus/:id',authenticateManager,toggleMeterStatus)
managerRouter.put('/room-details/lock-meter/:id',authenticateManager,lockMeter)

module.exports = managerRouter