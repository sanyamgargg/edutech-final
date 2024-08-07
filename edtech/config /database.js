const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('DB connected Successfully');
    } catch (error) {
        console.error('DB connection Unsuccessful');
        console.error(error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
