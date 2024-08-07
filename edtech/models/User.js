const mongoose = require('mongoose') ;
const {Schema} = require('mongoose') ;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        
    },
    accountType: {
        type:String,
        enum: ["Admin","Student","Instructor"],
        required: true
    },
    additionalDetails: {
        type:mongoose.Schema.Types.ObjectId,
        
        ref: "Profile"
    },
    token: {
        type: String,
    },
    resetPasswordExpiration:{
        type: Date,
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Course",
        }
    ],
    image: {
        type: String,
        
    },
    courseProgress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseProgress"
        }
    ]
})

module.exports = mongoose.model("User",userSchema) ;