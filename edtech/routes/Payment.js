const express = require("express") ;
const router = express.Router() ;

const { capturePayments, verifySignature} = require("../controllers/Payments") ;
const {auth,isStudent,isAdmin,isInstructor} = require("../middlewares/auth") ;

router.post("/capturePayments",auth,isStudent,capturePayments) ;
router.post("/verifySignature", verifySignature) ;

module.exports = router ;


