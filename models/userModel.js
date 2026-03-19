const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword:{
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    isVerfied: {
        type: Boolean,
        default: false
    },
    passwordResetToken: String,
    passwordResetExpire: Date,
    emailVerificationToken: String,
    emailVerificationExpire: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);