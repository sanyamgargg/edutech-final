const express = require("express") ;
const router = express.Router() ;

const {createCourse,getAllCourses,getCourseDetails} = require("../controllers/Course") ;
const {createCategory,showAllCategory,categoryPageDetails} = require("../controllers/Category") ;
const {createRating,getAllRating,averageRating} = require("../controllers/RatingAndReview") ;
const {createSection,updateSection,deleteSection} = require("../controllers/Section") ;
const {createSubSection} = require("../controllers/SubSection") ;

const {auth,isAdmin,isStudent,isInstructor} = require("../middlewares/auth") ;


router.post("/createCourse",auth,isInstructor,createCourse) ;
router.post("/addSection",auth,isInstructor,createSection) ;
router.post("/updateSection",auth,isInstructor,updateSection) ;
router.post("/deleteSection",auth,isInstructor,deleteSection) ;
router.post("/createSubSection",auth,isInstructor,createSubSection) ;

router.post("/createCategoy",auth,isAdmin,createCategory) ;

router.post("/createRating",isStudent,createRating) ;

router.post("/showAllCategory",showAllCategory) ;
router.post("/categoryPageDetails",categoryPageDetails) ;
router.post("/getAllCourses",getAllCourses) ;
router.post("/getCourseDetails",getCourseDetails) ;
router.post("/getAllRating",getAllRating) ;
router.post("/averageRating",averageRating) ;

module.exports = router ;
