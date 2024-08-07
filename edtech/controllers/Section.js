const Section = require("../models/Section") ;
const Course = require("../models/Course") ;
const { findByIdAndUpdate } = require("../models/User");


/* ------------------- Create Section -------------------------- */

exports.createSection = async (req,res)=>{
    try {
        //1. data fetch
        const {sectionName, courseId} = req.body ;
        //2. data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "Insucfficient data"
            })
        }
        //3. create section
        const newSection = await Section.create({sectionName}) ;
        //3. update course with section objectId
        const updateCourseDetails = await Course.findByIdAndUpdate(
                                                                    {courseId},
                                                                    {
                                                                        $push: {
                                                                            courseContent: newSection._id 
                                                                        }
                                                                    },
                                                                    {new:true}
        )
        //Hw: TO use populate to replace both section/sub-section both in course updatedCourseDetails
        //5. return response
        return res.status(200).json({
            success:true,
            message:"Section was created successfully" 
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "There was an error while creating new section",
            error: error.message

        })
    }
}

/* ------------------- Update Section -------------------------- */
exports.updateSection = async (req,res) => {
    try {
        //1. data input
        const {sectionName, sectionId} = req.body ;
        //2. data validation
        if(!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Insucfficient data"
            })
        }
        //3. update data
        const sectionUpdate = await Section.findByIdAndUpdate({sectionId},{sectionName},{new:true}) ;
        //4. return response
        return res.status(200).json({
            success:true,
            message:"Section was updated successfully" 
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "There was an error while updating new section",
            error: error.message

        })
    }
}

/* ------------------- Delete Section -------------------------- */

exports.deleteSection = async(req,res)=>{
    try {
        //1. getId
        const {sectionId} = req.params ;

        //2. find by Id and delete
        await Section.findByIdAndDelete(sectionId) ; 
        //Doubt do we need to delete this from course Schema 
        //3. return response
        return res.status(200).json({
            success:true,
            message:"Section was deleted successfully" 
        })

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "There was an error while deleting new section",
            error: error.message

        })
    }
}
