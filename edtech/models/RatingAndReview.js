const mongoose = require('mongoose') ;
const {Schema} = require('mongoose') ;

const ratingAndReviewSchema = new Schema({
   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
   },
   courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Course",
      required: true
   },
   rating: {
    type: Number,
    required: true
    },
   review: {
    type: String,
    required: true

   }
})

module.exports = mongoose.model("RatingAndReview",ratingAndReviewSchema) ;