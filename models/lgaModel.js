const mongoose =  require('mongoose');

const lgaSchema = new mongoose.Schema({
     lgaName:{
        type: String,
        required: true,
        unique: true
    },
    lgaChairman:{
        type: String,
        required: true
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "State",
        required: true
    },
    community: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community"
    }]
    
});

module.exports = mongoose.model("LGA", lgaSchema)