# 🔧 Production Issues - FIXED

## ✅ Problems Identified and Fixed

### 1. **Port Mismatch (CRITICAL - FIXED)**

- **Problem**: Frontend was pointing to `http://localhost:3000` but backend runs on `8000`
- **Solution**: Updated `frontend/.env` to use `http://localhost:8000`
- **Status**: ✅ FIXED

### 2. **Backend Port Configuration (FIXED)**

- **Problem**: Backend `.env` had `PORT = 3000`
- **Solution**: Changed to `PORT = 8000` for consistency
- **Status**: ✅ FIXED

### 3. **Email Configuration Issues (NEEDS VERIFICATION)**

- **Problem**: Registration fails because email isn't being sent
- **Likely Causes**:
  - Gmail App Password might be invalid/revoked
  - Backend environment variables not set in production (Render)
  - Gmail account might not have 2FA enabled
- **Solution**:
  1. Verify `GMAIL_PASS` in backend/.env is correct (should be 16 characters from Google App Passwords)
  2. If invalid, regenerate from: https://myaccount.google.com/apppasswords
  3. Add improved error logging to help debug issues
- **Status**: ⚠️ NEEDS YOUR VERIFICATION

### 4. **Improved Error Handling (FIXED)**

- Added better error messages for email configuration issues
- Added HTML email template with OTP
- Added detailed console logging for debugging
- User records are deleted if email fails (avoid orphaned data)
- **Status**: ✅ FIXED

## 📋 Files Modified

1. `backend/.env` - Fixed PORT to 8000
2. `backend/utils/nodemailer.js` - Improved error handling and logging
3. `backend/controllers/auth.controller.js` - Better error messages and data cleanup
4. `frontend/.env` - Fixed API URL to localhost:8000
5. `frontend/.env.local` - Development config
6. `frontend/.env.production` - Production config template
7. `PRODUCTION_SETUP.md` - Complete deployment checklist

## 🚀 What To Do Next For Production

### Step 1: Test Locally

```bash
cd backend && npm start
# In another terminal:
cd frontend && npm run dev
```

Try registering - you should see the email error in console with more details.

### Step 2: Fix Gmail Configuration

If you see email errors, your Gmail App Password is likely invalid:

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Google generates a 16-character password
4. Copy it and update `backend/.env`:
   ```
   GMAIL_PASS=the_16_char_password_here
   ```
5. Restart backend server

### Step 3: Deploy to Render

1. Push code to GitHub
2. In Render dashboard, create environment variables:
   - `MONGODB_URI` - your MongoDB connection
   - `GMAIL_USER` - your Gmail address
   - `GMAIL_PASS` - verified working Google App Password
   - `JWT_SECRET` - any secure random string
   - `RAZORPAY_KEY_ID` - your Razorpay key
   - `RAZORPAY_KEY_SECRET` - your Razorpay secret
   - `CLOUDINARY_*` - all Cloudinary variables
   - `PORT` - 8000

3. Update `frontend/.env.production`:

   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com
   ```

4. Deploy frontend to Vercel with the updated .env.production

## 🧪 Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend can reach backend (no 404 errors)
- [ ] Registration page loads
- [ ] Can fill in registration form
- [ ] OTP email arrives within 30 seconds
- [ ] Can verify OTP
- [ ] Login works after verification
- [ ] Cart functionality works
- [ ] Checkout works with Razorpay

## 📞 If Issues Persist

1. Check backend logs in Render dashboard
2. Verify all environment variables are set
3. Test email with a temporary script:
   ```javascript
   const nodemailer = require("nodemailer");
   // Use your GMAIL_USER and GMAIL_PASS to test
   ```
4. Check Gmail's "Less secure app access" setting (though Google App Passwords bypass this)
