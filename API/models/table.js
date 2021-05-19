const mongoose = require('mongoose');


const tableSchema = mongoose.Schema({
    number: {
        type: String,
        unique: true,
    },
    key: {
        type: String,
        unique: true,
    },
    slot:{
        type:String,
        default:'',
    },
})
module.exports = mongoose.model('table', tableSchema);