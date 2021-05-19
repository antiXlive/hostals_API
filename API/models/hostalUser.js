const mongoose = require('mongoose');

const hostalsUserSchema = mongoose.Schema({
    fullName: {
        type: String
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String
    },
    temp_password: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        default: 'student'
    },
    verification_code: {
        type: String,
    },
    verification_expiry: {
        type: String,
    }
})
module.exports = mongoose.model('hostals_user', hostalsUserSchema);