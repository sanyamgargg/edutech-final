const nodemailer = require('nodemailer');
require('dotenv').config();

let mailSender = async (email, title, body) => {
    try {
        

        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        let info = await transporter.sendMail({
            from: `EduTech <${process.env.MAIL_USER}>`,
            to: email,
            subject: title,
            html: body
        });

        console.log('Email sent successfully:');
        return info;
    } catch (error) {
        console.log('Error sending email:', error.message);
        console.log(error);
    }
};

module.exports = mailSender;
