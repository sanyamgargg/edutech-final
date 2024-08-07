const mongoose = require('mongoose') ;
const {Schema} = require('mongoose') ;


const SectionSchema = new Schema({
   sectionName: {
    type:String
   },
   subSection: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubSection"
   }]
})

module.exports = mongoose.model("Section", SectionSchema) ;