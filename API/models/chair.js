const mongoose = require('mongoose');


const chairSchema = mongoose.Schema({
    number: {
        type: String,
        unique: true,
    },
    slot:{
        type:String,
        default:'',
    },
})
module.exports = mongoose.model('chair', chairSchema);