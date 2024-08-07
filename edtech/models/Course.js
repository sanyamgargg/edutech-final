const mongoose = require('mongoose') ;
const {Schema} = require('mongoose') ;

const courseSchema = new Schema({
    courseName:{
        type:String,
        trim: true,
        required: true
    },
    description: {
        type: String
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    whatYouWillLearn: {
        type: String,
    },
    courseContent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true
    },
    ratingAndReview: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview"
    },
    price: {
        type: String
    },
    thumbnail: {
        type: String
    },
    tags: {
        type: [String],
        required: true
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    studentEnrolled: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    instructions:{
        type: String
    },
    status:{
        type: String,
        enum: ["Draft","Published"]
    }

})

module.exports = mongoose.model("Course",courseSchema) ;