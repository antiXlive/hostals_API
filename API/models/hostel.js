const mongoose = require('mongoose');

const hostelSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
    category: {
        type: String
    },
    rooms: {
        type: Number,
        default: 0
    },
    students: {
        type: Number,
        default: 0,
    }
})
module.exports = mongoose.model('hostel', hostelSchema);