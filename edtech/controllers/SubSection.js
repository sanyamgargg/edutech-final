const Section = require("../models/Section")
const SubSection = require("../models/SubSection"); 
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create subsection
exports.createSubSection = async (req,res) => {
    try {
        //1. fetch data
        const {sectionId, title, timeDuration, description} = req.body ;
        //2. extract file video
        const video = req.files.videoFile ;
        //3. validation
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success: false,
                message: "Insufficient data"
            })
        }
    
        //4. upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME) ;
        //5. create subsection
        const subSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoURL: uploadDetails.secure_url
        })
        //6. update section with this subsection's object Id
        const updatedSection = await Section.findByIdAndUpdate({sectionId},
                                                                {
                                                                    $push: {
                                                                        subSection: subSectionDetails._id
                                                                    }
                                                                },
                                                                {new:true}
        )
        // return response
        return res.status(200).json({
            success: true,
            message: "SubSection was created Successfully"
        })
    } catch (error) {
        console.log(erro)
        return res.status(500).json({
            success: false,
            message: "An error occured while creating subsection"
        })
    }
}


//Hw: update and delete subsection