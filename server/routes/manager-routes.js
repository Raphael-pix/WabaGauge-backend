const express = require('express')
const managerRouter = express.Router()

const {signup,login,getAllMeters,getMeterDetails,toggleMeterStatus,lockMeter} = require('../controller/manager-controller')


// Middleware to authenticate manager
async function authenticateManager(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, 'SECRET_KEY');
        const manager = await User.findById(decoded.id);
        if (!manager || manager.role !== 'manager') throw new Error();

        req.manager = manager;
        next();
    } catch (err) {
        res.status(401).json({message:'Unauthorized'});
    }
}

managerRouter.get('/',authenticateManager,getAllMeters)
managerRouter.post('/create-account',signup)
managerRouter.post('/login',login)
managerRouter.get('/room-details/:id',authenticateManager,getMeterDetails)
managerRouter.put('/room-details/:id',authenticateManager,toggleMeterStatus)
managerRouter.put('/room-details/:id',authenticateManager,lockMeter)

module.exports = managerRouter