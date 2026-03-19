const mongoose =  require('mongoose');

const communitySchema = new mongoose.Schema({
    communityName:{
        type: String,
        required: true,
    },
    lga: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LGA",
        required: true
    }
   
});

module.exports = mongoose.model("Community", communitySchema)