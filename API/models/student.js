const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
    },
    roll: {
        type: String,
    },
    department: {
        type: String,
        default: false,
    },
    batch: {
        type: String,
        default: 'Normal',
    },
    degree: {
        type: String,
    },
    contact: {
        type: String,
    },
    gender: {
        type: String,
    },
    roomSlot:{
        type: String,
        default:'',
    },
    verification_code: {
        type: String,
    },
    verification_expiry: {
        type: String,
    }
})
module.exports = mongoose.model('student', studentSchema);