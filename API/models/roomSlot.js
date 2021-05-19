const mongoose = require('mongoose');


const roomSlotSchema = mongoose.Schema({
    number: Number,
    hostelName: String,
    roomName: String,
    hostel: String,
    room: String,
    almirah: String,
    bed: String,
    chair: String,
    table: String,
    student:  {
        type: String,
        default: '',
    },
})
module.exports = mongoose.model('roomSlot', roomSlotSchema);