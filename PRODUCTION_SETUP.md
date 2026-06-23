# Production Deployment Checklist

## Required Environment Variables for Production

Before deploying to production (Render, Vercel, etc.), ensure ALL these variables are set:

### Email Configuration (CRITICAL for Registration)

- `GMAIL_USER`: Your Gmail address
- `GMAIL_PASS`: Gmail App Password (NOT your regular password!)
  - **How to generate**:
    1. Go to https://myaccount.google.com/apppasswords
    2. Select "Mail" and "Windows Computer" (or your device)
    3. Google will generate a 16-character password
    4. Copy it exactly as shown (with or without spaces)
    5. Paste into GMAIL_PASS variable

### Database

- `MONGODB_URI`: Your MongoDB connection string

### Security

- `JWT_SECRET`: A random secure string (min 32 characters recommended)

### Payment Gateway

- `RAZORPAY_KEY_ID`: Your Razorpay key
- `RAZORPAY_KEY_SECRET`: Your Razorpay secret

### Cloud Storage (if using image uploads)

- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
- `CLOUDINARY_UPLOAD_FOLDER`: Folder name for uploads

### Server

- `PORT`: Server port (default: 8000)

## Deployment Steps for Render

1. Push code to GitHub
2. Connect GitHub repository to Render
3. In Render Dashboard > Environment variables section, add ALL the above variables
4. **Important**: Use App Passwords from Google, not regular Gmail passwords
5. Deploy and test registration flow

## Testing Email in Production

1. Try registering with a test email
2. Check the OTP email arrives within 30 seconds
3. If fails, check Render logs for detailed error messages
