const mongoose = require('mongoose') ;
const {Schema} = require('mongoose') ;

const categorySchema = new Schema({
    name: {
        type:String,
        required: true
    },
    description: {
        type: String,
        
    },
    course: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }
    ]
})

module.exports = mongoose.model("Category",categorySchema) ;