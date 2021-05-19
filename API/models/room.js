const mongoose = require('mongoose');


const roomSchema = mongoose.Schema({
    name: {
        type: String,
    },
    students: {
        type: Number,
        default: 0,
    },
    hostelName: {
        type: String,
    },
    complaints: {
        type: Number,
        default: 0
    },
    slots: {
        type: Number,
        default: 0,
    },
    hostel: {
        type: String
    },
})
module.exports = mongoose.model('room', roomSchema);