const express = require('express')
const userRouter = express.Router()

const {signup,login,getMeterDetails,toggleMeterStatus} = require('../controller/user-controller')

// Middleware to authenticate user
async function authenticateUser(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, 'SECRET_KEY');
        const user = await User.findById(decoded.id);
        if (!user || user.role !== 'user') throw new Error();

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({message:'Unauthorized'});
    }
}

userRouter.post('/create-account',signup)
userRouter.post('/login',login)
userRouter.get('/:id',authenticateUser,getMeterDetails)
userRouter.put('/:id',authenticateUser,toggleMeterStatus)

module.exports = userRouter