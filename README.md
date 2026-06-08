# 🛒 MERN Stack E-Commerce Platform

A full-stack **MERN E-Commerce application** with secure authentication, OTP verification, admin dashboard, product management, order system, and payment integration.

---

## 🚀 Live Demo

*(Add your deployed links here)*
Frontend: https://e-commerse-website-frontend-wu4u.onrender.com
Backend: https://e-commerse-website-backend-b45e.onrender.com

---

## ✨ Features

### 👤 User Features

* User Registration with OTP Verification
* Secure Login (JWT Authentication)
* Browse Products & Categories
* Product Details Page
* Add to Cart System
* Order Placement
* User Profile Management
* Responsive UI

---

### 🛠️ Admin Features

* Admin Dashboard
* Product Management (Add / Edit / Delete)
* Category Management
* Order Management
* User Management
* Inventory Control
* Sales Overview

---

### 💳 Payment Integration

* Razorpay Payment Gateway

---

### ☁️ Media Handling

* Cloudinary Image Uploads

---

### 🔐 Authentication System

* JWT Authentication
* OTP Email Verification (Nodemailer + Gmail SMTP)
* Role-Based Access (User / Admin)

---

## 💻 Tech Stack

### Frontend

* React.js
* Axios
* React Router DOM
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT
* Nodemailer
* Multer
* Cloudinary

---

## ⚙️ Environment Variables

### 📌 Backend `.env`

```env id="envbackend"
PORT=8000
MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

FRONTEND_URL=https://your-frontend-url.onrender.com

# Gmail SMTP (OTP)
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_gmail_app_password

# Razorpay
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

---

### 📌 Frontend `.env`

```env id="envfrontend"
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## 🔐 Admin Demo Access

Email: `rachitthapliyal61@gmail.com`
Password: `Rachit@123`

⚠️ This is a demo account for testing admin functionality only.

---

## 📸 Project Highlights

* Full Stack MERN Architecture
* Secure Authentication System
* OTP Email Verification
* Role-Based Access Control
* Payment Gateway Integration
* Cloudinary Image Uploads
* Responsive Design
* Scalable Backend Structure

---

## 📂 Project Structure

```
backend/
frontend/
models/
routes/
controllers/
middlewares/
```

---

## 🚀 Installation

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📈 Future Improvements

* Product Reviews & Ratings
* Coupon System
* Multi-Vendor Support
* Email Notifications
* Advanced Analytics Dashboard

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 👨‍💻 Author

Built with ❤️ by Rachit using MERN Stack
