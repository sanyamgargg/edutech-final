# EduTech Platform - Setup Guide

## Project Overview

This is a comprehensive education platform built with MERN stack (MongoDB, Express.js, React.js, Node.js) featuring user authentication, course management, payments, and more.

## Features

- **User Authentication**: Signup, login, password reset with OTP
- **Course Management**: Create, view, and manage courses
- **User Roles**: Student, Instructor, and Admin roles
- **Payment Integration**: Razorpay payment gateway
- **File Upload**: Cloudinary integration for images
- **Responsive Design**: Modern UI with Tailwind CSS
- **Real-time Notifications**: Toast notifications

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Backend Setup

### 1. Install Dependencies

```bash
cd edtech
npm install
```

### 2. Environment Variables

Create a `.env` file in the `edtech` folder with the following variables:

```env
PORT=4000
MONGODB_URL=mongodb://localhost:27017/edutech
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
MAIL_HOST=smtp.gmail.com
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-email-password
MAIL_FROM=your-email@gmail.com
```

### 3. Start Backend Server

```bash
cd edtech
npm run dev
```

The backend will run on `http://localhost:4000`

## Frontend Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Frontend Development Server

```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/sendotp` - Send OTP
- `POST /api/v1/auth/changepassword` - Change password
- `POST /api/v1/auth/reset-password-token` - Reset password token
- `POST /api/v1/auth/reset-password` - Reset password

### Courses

- `POST /api/v1/course/getAllCourses` - Get all courses
- `POST /api/v1/course/getCourseDetails` - Get course details
- `POST /api/v1/course/createCourse` - Create course (Instructor only)
- `POST /api/v1/course/createCategoy` - Create category (Admin only)
- `POST /api/v1/course/showAllCategory` - Get all categories
- `POST /api/v1/course/createRating` - Create rating (Student only)

### Profile

- `PUT /api/v1/profile/updateProfile` - Update profile
- `DELETE /api/v1/profile/deleteProfile` - Delete account

### Payments

- `POST /api/v1/payment/capturePayments` - Capture payment
- `POST /api/v1/payment/verifySignature` - Verify payment signature

## User Roles

### Student

- Browse and enroll in courses
- Rate and review courses
- Manage profile
- View enrolled courses

### Instructor

- Create and manage courses
- Add sections and subsections
- View course analytics
- Manage profile

### Admin

- Access admin dashboard
- Manage categories
- View platform statistics
- Manage users and courses

## Technologies Used

### Backend

- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcrypt for password hashing
- nodemailer for emails
- Razorpay for payments
- Cloudinary for file uploads

### Frontend

- React.js
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- React Hot Toast for notifications
- Heroicons for icons

## Project Structure

```
edutech-final/
├── edtech/                 # Backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Custom middlewares
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── index.js          # Server entry point
├── src/                  # Frontend
│   ├── components/       # Reusable components
│   ├── context/          # React context
│   ├── pages/           # Page components
│   ├── services/        # API services
│   └── App.js           # Main app component
└── package.json
```

## Getting Started

1. **Clone the repository**
2. **Set up the backend** (follow backend setup steps)
3. **Set up the frontend** (follow frontend setup steps)
4. **Create test accounts**:
   - Student account
   - Instructor account
   - Admin account
5. **Test the features**:
   - User registration and login
   - Course creation (as instructor)
   - Course enrollment (as student)
   - Payment integration
   - Admin dashboard

## Notes

- The backend uses MongoDB. Make sure MongoDB is running locally or update the MONGODB_URL to point to your cloud database.
- For production, update all environment variables with proper values.
- The payment integration uses Razorpay. You'll need to set up a Razorpay account and get API keys.
- File uploads use Cloudinary. Set up a Cloudinary account and get the necessary credentials.
- Email functionality uses nodemailer with Gmail. You may need to enable "Less secure app access" or use app-specific passwords.

## Troubleshooting

1. **Backend not starting**: Check if MongoDB is running and environment variables are set correctly.
2. **Frontend not connecting to backend**: Verify the backend is running on port 4000 and CORS is configured properly.
3. **Authentication issues**: Check JWT_SECRET in environment variables.
4. **Payment issues**: Verify Razorpay credentials are correct.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Feel free to use and modify as needed.
