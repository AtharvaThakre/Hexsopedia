# MongoDB & Environment Setup Guide

## ✅ What's Already Done:
- `.env` file created in backend folder
- Backend dependencies installed

## 🗄️ MongoDB Setup (Choose One Option)

### Option 1: Local MongoDB (Recommended for Development)

#### Windows Setup:
1. **Download MongoDB:**
   - Visit: https://www.mongodb.com/try/download/community
   - Download MongoDB Community Server for Windows
   - Install with default settings (check "Install as Service")

2. **Verify Installation:**
   ```cmd
   mongo --version
   ```

3. **Start MongoDB Service:**
   ```cmd
   net start MongoDB
   ```

4. **Your .env is already configured for local:**
   ```
   MONGODB_URI=mongodb://localhost:27017/hexsopedia
   ```

### Option 2: MongoDB Atlas (Cloud - Free)

1. **Create Account:**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up for free

2. **Create Free Cluster:**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select region close to you

3. **Create Database User:**
   - Go to "Database Access"
   - Add new user with username/password
   - Save credentials!

4. **Whitelist IP:**
   - Go to "Network Access"
   - Add IP Address → "Allow Access from Anywhere"

5. **Get Connection String:**
   - Click "Connect" on cluster
   - Choose "Connect your application"
   - Copy connection string

6. **Update .env file:**
   Replace MONGODB_URI with:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hexsopedia?retryWrites=true&w=majority
   ```

## 🚀 Running the Application

### Start Backend:
```cmd
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

### Start Frontend (in new terminal):
```cmd
cd frontend
npm install
npm start
```
Frontend runs on: http://localhost:3000

## 🔧 Environment Variables Explained

Your `.env` file contains:
- **PORT**: Backend server port (5000)
- **MONGODB_URI**: Database connection string
- **JWT_SECRET**: Secret key for JWT tokens (CHANGE IN PRODUCTION!)
- **JWT_EXPIRE**: Token expiration time (7 days)
- **NODE_ENV**: Environment mode (development/production)

## ⚠️ Important Security Notes

1. **Never commit .env file to Git** (already in .gitignore)
2. **Change JWT_SECRET in production** to a random secure string
3. **Use strong database passwords**
4. **In production, restrict IP access to your server only**

## 🐛 Troubleshooting

### MongoDB Connection Issues:
- Ensure MongoDB service is running: `net start MongoDB`
- Check if port 27017 is available
- Verify connection string in .env

### Backend Won't Start:
- Make sure .env file exists in backend folder
- Check if PORT 5000 is available
- Run `npm install` again

### Frontend Issues:
- Clear node_modules: `rmdir /s node_modules` then `npm install`
- Check if backend is running on port 5000

## 📚 Next Steps

1. Start MongoDB (local or Atlas)
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm start`
4. Register your first user at http://localhost:3000
5. Create your first knowledge entry!

## 🔐 Creating Admin User

After registering, make yourself admin via MongoDB:

**MongoDB Shell:**
```javascript
use hexsopedia
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

**MongoDB Compass:**
1. Connect to database
2. Select "hexsopedia" database
3. Select "users" collection
4. Find your user and edit
5. Change role from "user" to "admin"
