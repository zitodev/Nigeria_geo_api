const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    stateName: {
        type: String,
        required: true,
        unique: true
    },
    stateCapital: {
        type: String,
        required: true,
    },
    slogan: { 
        type: String,
        required: true,
    },
    governorName: {
        type: String,
        required: true,
    },
    zonalRegion: {
        type: String,
        required: true
    },
    landMark:{
        type: String,
        required: true
    },
    yearCreated:{
        type: String,
        required: true
    },
    lga: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "LGA"
    }]

}, { timestamps: true });

module.exports = mongoose.model('State', stateSchema);