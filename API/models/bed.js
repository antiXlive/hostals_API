const mongoose = require('mongoose');


const bedSchema = mongoose.Schema({
    number: {
        type: String,
        unique: true,
    },
    slot:{
        type:String,
        default:'',
    },
})
module.exports = mongoose.model('bed', bedSchema);