const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema({
    hostel: {
        type: String
    },
    room: {
        type: String
    },
    resolved: {
        type: Number,
        default: 0,
    },
    student: {
        type: String
    },
    message: {
        type: String
    }
})
module.exports = mongoose.model('complaint', complaintSchema);