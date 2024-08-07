const mongoose = require('mongoose') ;
const {Schema} = require('mongoose') ;

const subSectionSchema = new Schema({
    title: {
        type: String,
    },
    timeDuration: {
        type: String,
    },
    description: {
        type: String,
    },
    videoURL: {
        type: String,
         }
})

module.exports = mongoose.model("SubSection", subSectionSchema) ;