const Category = require("../models/Category") ;




/* -------------------- Creating Category Function ------------------------ */
exports.createCategory = async(req,res)=>{
    try {
        //1. fetch data
        const {name,description} = req.body ;
        //2. Validation
        if(! name || !description){
            return res.status(400).json({
                success: false,
                message: "Insufficient data for creating tags" 
            })
        }
        //3. Create entry in DB
        const categoryDetails = await Category.create({
            name: name ,
            description: description
        })
        //4. Return response
        return res.json({
            success: true,
            message: "Tag was successfully created"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
} 

/* -------------------- Show all category ------------------------ */

exports.showAllCategory = async(req,res)=>{
    try {
        const getAllCategory = await Category.find({},{name:true, description:true})
        return res.json({
            success: true,
            message: "All Category was returned successfully"
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

/* -------------------- Category page details ------------------------ */
exports.categoryPageDetails = async(req,res)=>{
    try {
        //1. get category id
        const {categoryId} = req.body;
        //2. get courses for specific category id
        const getSelectedCourse = await Category.findById(categoryId)
                                                        .populate("course")
                                                        .exec() ;
        //3. validation
        if(!getSelectedCourse){
            return res.status(401).json({
                success: false,
                message: "No course was found for the selected course."
            })
        }
        //4. get courses for different category
        const getDifferentCourse = await Category.findById({_id: {$ne: categoryId}})
                                                            .populate("course")
                                                            .exec() ;
        //5. get top selling course
        //6. return response
        return res.status(200).json({
            success: true,
            data: {
                getSelectedCourse,
                getDifferentCourse
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message 
        })
    }
}