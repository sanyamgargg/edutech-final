const Profile = require("../models/Profile") ;
const User = require("../models/User") ;

//update profile (already null values exist for profile)
exports.updateProfile = async(req,res)=>{
    try {
        //1. get data
    const {dateOfBirth="", about="", gender, contactNumber} = req.body ;
    //2. get user id 
    const id = req.user.id ;

    // validation
    if(!id || !gender || !contactNumber){
        return res.status(400).json({
            success: false,
            message: "Insufficient data"
        })
    }
    //3. find profile
    const userDetails = await User.findById(id) ;
    const profileId = await userDetails.additionalDetails ;
    const profileDetails = await Profile.findById(profileId) ;
    //4. update profile
    profileDetails.gender = gender ;
    profileDetails.contactNumber = contactNumber ;
    profileDetails.about = about;
    profileDetails.dateOfBirth =dateOfBirth ;
    await profileDetails.save() ;

    //5. return response
    return res.status(200).json({
        success: true,
        message: "Profile was updated successfully",
        profileDetails
    })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "An error occured while updating the profile",
            error: error.message
        })
    }
}

// delete account
exports.deleteAccount = async(req,res)=>{
    try {
        //1. get id
        const id = req.user.id ;
        //2. validate
        const userDetails = User.findById(id) ;
        if(!userDetails){
            return res.status(400).json({
                success: false,
                message: "User was not found"
            })
        }

        //3. delete profile
        const deleteProfile = await Profile.findById({_id:userDetails.additionalDetails}) ;
        //4. delete User
        const deleteUser = await User.findById({_id:id})
        //5. return response
        return res.status(200).json({
            success: true,
            message: "User was successfully deleted",
          
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "An error occured while deleting the user.",
            error: error.message
        })
    }
}


