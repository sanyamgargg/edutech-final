const mongoose = require('mongoose') ;
const {Schema} = require('mongoose') ;

const courseProgressSchema = new Schema({
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    completedVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection"
        }
    ]
})

module.exports = mongoose.model("CourseProgress",courseProgressSchema) ;