const User = require("../models/User") ;
const Course = require("../models/Course") ;
const Category = require("../models/Category") ;
const uploadImageToCloudinary = require("../utils/imageUploader") ;


/* ---------------- create Courser handler function -------------------- */
exports.createCourse = async(req,res)=>{
    try {
        //1. fetch data
        const {courseName, courseDescription, whatYouWillLearn, price,category,tags} = req.body ;
        //2. get thumbnail
        const thumbnail = req.files.thumbnail ;
        //3. validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail ||!tags){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        //4. check for instructor
        const userId = req.user.id ;
        const instructorDetails = await User.findById(userId) ;
        console.log("Instructor Details: ",instructorDetails) ;

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: "No instructor was found"
            })
        }
        //5. check given tag is valid or not
        const categoryDetails = await Category.findById(category) ;
        if(!categoryDetails){
            return res.status(404).json({
                success: false,
                message: "No such category was found"
            })
        }
        //6. upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME) ;
        //7. create an entry for new course
        const newCourse = Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id ,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tags: tags,
            category: categoryDetails._id,
            thumbnail: thumbnailImage
        })
        //8. add new course to the User wala schema of instructor
        await User.findOneAndUpdate({_id: instructorDetails._id},
            {
                $push: {
                    courses: newCourse._id ,
                }
            },
            {new:true}
        )
        //9. update the tag schema
        await categoryDetails.findByIdAndUpdate({_id: categoryDetails._id},
            {
                $push: {
                    course: newCourse._id,
                }
            }
        )
        //10.return response
        return res.status(200).json({
            success:true,
            message: "Course created successfully"
        })
    } catch (error) {
        console.log(error) ; 
        return res.status(500).json({
            success:false,
            message: "An error occured while creating course.",
            error: error.message
        })
        
    }
}

/* ---------------- get all Courses handler function -------------------- */
exports.getAllCourses = async(req,res)=>{
    try {

        const allCourses = await Course.find({}) ;
        // const allCourses = await Course.find({},{courseName:true,
        //                                          price:true,
        //                                          ratingAndReview:true,
        //                                          thumbnail:true,
        //                                          studentEnrolled:true})
        //                                          .populate("instructor")
        //                                          .exec() ;
    
        return res.status(200).json({
            success:true,
            message: "All Courses found successfully"

    })
    }catch (error) {
        console.log(error) ;
        return res.status(500).json({
            success:false,
            message: "An error occured while fetching all courses.",
            error: error.message
        })
    }
}

/* ---------------- get Course Details -------------------- */
exports.getCourseDetails = async(req,res)=>{
    try {
        const {courseId} = req.body ;

    const courseDetails = await Course.find({_id:courseId})
                                        .populate(
                                            {
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails"
                                                }
                                            }
                                        )
                                        .populate(
                                            {
                                                path:"courseContent",
                                                populate:{
                                                    path:"subSection"
                                                }
                                            }
                                        )
                                        .populate("ratingAndReviews")
                                        .populate("category")
                                        .exec()


    if(!courseDetails){
        return res.json({
            success: false,
            message: "No course detail was found"

        })
    }
    
    return res.status(200).json({
        success: true, 
        message: "Course Details fetched successfully.",
        data: courseDetails
    })
    } catch (error) {
        console.log(error) ;
        return res.status(500).json({
            success: false,
            message: "An error occured while fetching the course details",
            error: error.message

        })
    }
}