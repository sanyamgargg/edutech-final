const mailSender = require("../mailSender");

const sendPaymentConfirmationEmail = async (email, userName, courseName) => {
    const emailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f7f7f7;
                margin: 0;
                padding: 0;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 20px;
                border: 1px solid #e0e0e0;
                box-shadow: 0 4px 8px rgba(0,0,0,0.05);
            }
            .header {
                text-align: center;
                padding: 10px 0;
                border-bottom: 1px solid #e0e0e0;
            }
            .header img {
                max-width: 150px;
            }
            .content {
                padding: 20px 0;
            }
            .content h1 {
                color: #333333;
                font-size: 24px;
            }
            .content p {
                color: #555555;
                font-size: 16px;
                margin: 10px 0;
            }
            .footer {
                text-align: center;
                padding: 10px 0;
                border-top: 1px solid #e0e0e0;
                color: #777777;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://via.placeholder.com/150" alt="EduTech Logo">
            </div>
            <div class="content">
                <h1>Payment Confirmation</h1>
                <p>Dear ${userName},</p>
                <p>Thank you for your payment for the course: <strong>${courseName}</strong>. We are pleased to inform you that your payment has been successfully processed.</p>
                <p>You can now access your course materials and start learning.</p>
            </div>
            <div class="footer">
                <p>If you have any questions, feel free to contact our support team.</p>
                <p>Thank you for choosing EduTech.</p>
                <p>&copy; 2024 EduTech. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    return mailSender(email, 'Payment Confirmation', emailTemplate);
};

module.exports = sendPaymentConfirmationEmail;
