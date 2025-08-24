# Environment Variables Setup Guide

## 📁 Files Created

- `edtech/.env` - Main environment file (you need to fill this)
- `edtech/.env.example` - Template file
- `edtech/.env.dev` - Development file with placeholder values

## 🔧 Required Environment Variables

### 1. Server Configuration

```env
PORT=4000
```

- **Description**: Port number for the backend server
- **Your Value**: Keep as `4000` or change if needed

### 2. Database Configuration

```env
MONGODB_URL=mongodb://localhost:27017/edutech
```

- **Description**: MongoDB connection string
- **Your Options**:
  - **Local MongoDB**: `mongodb://localhost:27017/edutech`
  - **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/edutech`
  - **Other**: Your MongoDB connection string

### 3. JWT Configuration

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

- **Description**: Secret key for JWT token generation
- **Your Value**: Generate a strong random string (at least 32 characters)
- **Example**: `my-super-secret-jwt-key-2024-edutech-platform`

### 4. Cloudinary Configuration

```env
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
```

- **Description**: Cloudinary credentials for file uploads
- **How to get**:
  1. Go to [Cloudinary](https://cloudinary.com/)
  2. Sign up/Login
  3. Go to Dashboard
  4. Copy your Cloud Name, API Key, and API Secret

### 5. Razorpay Configuration

```env
RAZORPAY_KEY=your-razorpay-key-id
RAZORPAY_SECRET=your-razorpay-key-secret
```

- **Description**: Razorpay credentials for payment processing
- **How to get**:
  1. Go to [Razorpay](https://razorpay.com/)
  2. Sign up/Login
  3. Go to Settings → API Keys
  4. Generate new key pair
  5. Copy Key ID and Key Secret

### 6. Email Configuration

```env
MAIL_HOST=smtp.gmail.com
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-email-app-password
MAIL_FROM=your-email@gmail.com
```

- **Description**: Email service configuration for OTP and notifications
- **For Gmail**:
  1. Enable 2-factor authentication on your Gmail
  2. Generate an App Password
  3. Use your Gmail address for MAIL_USER and MAIL_FROM
  4. Use the generated app password for MAIL_PASS

## 🚀 Quick Start Options

### Option 1: Use Development Values (Recommended for testing)

```bash
cd edtech
cp .env.dev .env
npm run dev
```

This will start the backend with placeholder values for testing.

### Option 2: Fill Real Values

1. Edit `edtech/.env`
2. Replace placeholder values with your actual credentials
3. Start the backend: `npm run dev`

### Option 3: Minimal Setup (for basic testing)

If you only want to test basic functionality without payments/email:

```env
PORT=4000
MONGODB_URL=mongodb://localhost:27017/edutech
JWT_SECRET=dev-jwt-secret-key-for-development-only
CLOUD_NAME=dev-cloud
API_KEY=dev-api-key
API_SECRET=dev-api-secret
RAZORPAY_KEY=rzp_test_dev
RAZORPAY_SECRET=dev-secret-key
MAIL_HOST=smtp.gmail.com
MAIL_USER=dev@example.com
MAIL_PASS=dev-password
MAIL_FROM=dev@example.com
```

## 🔍 Testing Your Setup

### 1. Test Database Connection

```bash
# Make sure MongoDB is running
mongod
```

### 2. Test Backend

```bash
cd edtech
npm run dev
```

You should see: "Your app is running at PORT: 4000"

### 3. Test Frontend

```bash
# In another terminal
npm start
```

Frontend should start on `http://localhost:3000`

## ⚠️ Important Notes

1. **Never commit `.env` files** - They contain sensitive information
2. **Use different values for development and production**
3. **Keep your JWT_SECRET secure and unique**
4. **For production, use strong, unique passwords**
5. **Test email functionality with a real email account**

## 🛠️ Troubleshooting

### Backend won't start

- Check if MongoDB is running
- Verify all environment variables are set
- Check for typos in variable names

### Payment issues

- Verify Razorpay credentials
- Use test credentials for development
- Check Razorpay dashboard for errors

### Email issues

- Verify Gmail app password
- Check if 2FA is enabled
- Test with a different email service if needed

### File upload issues

- Verify Cloudinary credentials
- Check Cloudinary dashboard
- Ensure proper file formats

## 📞 Support

If you encounter issues:

1. Check the console for error messages
2. Verify all environment variables are correctly set
3. Test each service individually
4. Check the service dashboards for any issues
