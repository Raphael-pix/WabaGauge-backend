const mongoose = require('mongoose')
const {Schema} = mongoose

const meterSchema = ({
    room_no: { 
        type: String, 
        required: true, 
        unique: true 
    },
    status: { 
        type: Boolean, 
        default: false 
    },
    units_used: { 
        type: Number, 
        default: 0 
    },
    last_usage_timestamp: { 
        type: Date, 
        default: null 
    },
    tampered: { 
        type: Boolean, 
        default: false 
    },
    alert_sent: { 
        type: Boolean, 
        default: false 
    },
    locked : {
        type : Boolean,
        default : true,
    }
})

module.exports = mongoose.model('Meter',meterSchema)