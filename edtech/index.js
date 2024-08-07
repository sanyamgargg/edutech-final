const express = require("express") ;
const app = express() ;

const userRoutes = require("./routes/User") ;
const profileRoutes = require("./routes/Profile") ;
const paymentRoutes = require("./routes/Payment") ;
const courseRoutes = require("./routes/Course") ;

const connectDB = require("./config /database") ;
const cookieParser = require("cookie-parser") ;
const cors = require("cors") ;
const {cloudinaryConnect} = require("./config /cloudinary") ;
const fileUplaod = require("express-fileupload") ;
const dotenv = require("dotenv") ;

dotenv.config() ;
const PORT = process.env.PORT || 4000 ;

//database connect
connectDB() ;

//middlewares
app.use(express.json()) ;
app.use(cookieParser()) ;
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials: true
    })
)

app.use(
    fileUplaod({
        userTempFiles:true,
        tempFileDir: "/tmp"
    })
)

//cloudinary connect
cloudinaryConnect() ;

//routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);

app.get("/",(req,res)=>{
    return res.json({
        success: true,
        message: "Your server is up and running."
    })
})

app.listen(PORT, ()=>{
    console.log(`Your app is running at PORT: ${PORT}`) 
})