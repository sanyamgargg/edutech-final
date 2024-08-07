const express = require("express") ;
const router = express.Router() ;

const {auth} = require("../middlewares/auth") ;
const {deleteAccount,updateProfile} = require("../controllers/Profile") ;

//profile routes
router.delete("/deleteProfile",auth,deleteAccount) ;
router.put("/updateProfile",updateProfile) ;

module.exports = router ;