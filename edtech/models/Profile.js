const mongoose = require('mongoose') ;
const {Schema} = require('mongoose') ;

const profileSchema = new Schema({
    gender: {
        type: String,
    },
    dateOfBirth: {
        type: String,
    },
    about: {
        type: String,
        trim: true
    },
    contactNumber: {
        type: Number,
        trim: true
    }
})

module.exports = mongoose.model("Profile",profileSchema) ;