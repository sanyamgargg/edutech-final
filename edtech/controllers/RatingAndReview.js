const RatingAndReview = require("../models/RatingAndReview") ;
const Course = require("../models/Course") ;
const { default: mongoose } = require("mongoose");



//create Rating
exports.createRating = async(req,res)=>{
    try {
        //1. get user id
    const userId = req.user.id ;
    //2. fetch data
    const {rating, review, courseId} = req.body ;
    //3. check if user is enrolled or not
    const checkStudent = await Course.find({_id:courseId,
                                            studentEnrolled: {$elemMatch:{$eq: userId}} ,
                                            })
    if(!checkStudent){
        return res.status(401).json({
            success: false,
            message: "Student is not permitted to review."
        })
    } ;
    //4. check if alrady reviewd the course or not
    const alreadyReviewed = await RatingAndReview.findOne({courseId:courseId, user: userId}) ;
    if(alreadyReviewed){
        return res.status(402).json({
            success: false,
            message: "Student has already reviewed the course."
        })
    }
    //5. create review rating
    const ratingReview = RatingAndReview.create({
            user:userId,
            courseId: courseId,
            rating: rating,
            review: review
    })
    //6. update course with rating
    const updatedCourse = await Course.findByIdAndUpdate({_id: courseId},
                                    {
                                        $push: {
                                            ratingAndReview: ratingReview._id
                                        }
                                    },
                                    {new:true}
    )
    //7. return response
    return res.status(200).json({
        success: true,
        message: "Review was successfully created"
    }
        
    )
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "There was an error while creating the review."
        })
    }

}

// Average rating
exports.averageRating = async(req,res)=>{
    try {
        const {courseId} = req.body.courseId ;

    const result = await RatingAndReview.aggregate([
        {
            $match:{
                courseId: mongoose.Types.ObjectId(courseId)  
            }
        },
        {
            $group:{
                _id:null,
                averageRating: { $avg: "$rating"}
            }
        }
    ])

    if(result.length>0){
        return res.status(200).json({
            success: true,
            averageRating: result[0].averageRating
        })
    }

    return res.status(200).json({
        success: true,
        message:"No ratings given yet." ,
        averageRating: 0
    })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message:"An error occured while calculating average rating" ,
        })
    }
}

//getAllRating
exports.getAllRating = async(req,res)=>{
    try {
        const allReviews = await RatingAndReview.find({})
                                                .populate({
                                                    path:"user",
                                                    select: "firstName lastName email image"
                                                })
                                                .populate({
                                                    path:"courseId",
                                                    select:"courseName"
                                                })
                                                .exec() ;

                                                return res.status(200).json({
                                                    success: true,
                                                    message:"All reviews fetched successfully" ,
                                                    
                                                })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message ,
        })
    }
}