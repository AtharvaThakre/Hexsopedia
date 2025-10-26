# Backend Deployment & Frontend Configuration Guide

## Step 1: Deploy Backend to Render.com

### 1.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub

### 1.2 Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: **Hexsopedia**
3. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `hexsopedia-backend` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

4. Click **"Advanced"** and add Environment Variables:

| Name | Value |
|------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A secure random string (e.g., `abc123xyz789secure`) |
| `JWT_EXPIRE` | `7d` |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `FRONTEND_URL` | (Leave empty for now, we'll add it later) |

5. Click **"Create Web Service"**

6. Wait 5-10 minutes for deployment

7. **Copy your backend URL** - It will look like:
   ```
   https://hexsopedia-backend.onrender.com
   ```

### 1.3 Test Backend
Visit your backend URL in browser:
```
https://hexsopedia-backend.onrender.com
```

You should see:
```json
{"message": "Welcome to Hexsopedia API"}
```

---

## Step 2: Update Frontend Configuration

### 2.1 Update .env.production
Open `frontend/.env.production` and replace with your actual backend URL:

```bash
# Replace with your Render backend URL from Step 1.7
REACT_APP_API_URL=https://hexsopedia-backend.onrender.com
CI=false
```

### 2.2 Verify API Configuration
The frontend is now configured to use the Render backend. All API calls will go to:
- **Development:** `http://localhost:5000/api/...` (via proxy)
- **Production:** `https://hexsopedia-backend.onrender.com/api/...`

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Push Changes to GitHub
```bash
git add .
git commit -m "Configure frontend to use Render backend"
git push origin main
```

### 3.2 Deploy to Vercel
1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your **Hexsopedia** repository
4. Configure build settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Create React App` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `build` |
| **Install Command** | `npm install` |

5. Add Environment Variable:

| Name | Value |
|------|-------|
| `REACT_APP_API_URL` | `https://hexsopedia-backend.onrender.com` |
| `CI` | `false` |

6. Click **"Deploy"**

7. Wait for deployment (2-3 minutes)

8. **Copy your frontend URL**:
   ```
   https://hexsopedia-xxxxx.vercel.app
   ```

---

## Step 4: Update Backend CORS

### 4.1 Add Frontend URL to Render
1. Go back to Render dashboard
2. Open your **hexsopedia-backend** service
3. Go to **"Environment"** tab
4. Add/Update:

| Name | Value |
|------|-------|
| `FRONTEND_URL` | `https://hexsopedia-xxxxx.vercel.app` |

5. Click **"Save Changes"**
6. Backend will automatically redeploy (1-2 minutes)

---

## Step 5: Test Your Deployment

### 5.1 Visit Your App
Go to your Vercel URL: `https://hexsopedia-xxxxx.vercel.app`

### 5.2 Test All Features
1. ✅ **Register** - Create a new account
2. ✅ **Login** - Sign in with credentials
3. ✅ **Create Entry** - Add a new knowledge entry
4. ✅ **Edit Entry** - Modify an existing entry
5. ✅ **Delete Entry** - Remove an entry
6. ✅ **Search** - Search by title/content/tags
7. ✅ **Admin Dashboard** - (if you're admin)

### 5.3 Troubleshooting

**Issue: CORS Error**
```
Access to fetch has been blocked by CORS policy
```
**Solution:**
- Verify `FRONTEND_URL` is correctly set in Render
- Check backend logs in Render dashboard
- Make sure the URL doesn't have trailing slash

**Issue: Network Error**
```
Failed to fetch
```
**Solution:**
- Check if backend is running (visit backend URL)
- Verify `REACT_APP_API_URL` in Vercel environment variables
- Check browser console for exact error

**Issue: 500 Internal Server Error**
```
Something went wrong
```
**Solution:**
- Check Render backend logs for error details
- Verify MongoDB connection string is correct
- Check all environment variables are set

---

## Architecture Summary

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Vercel (CDN)   │  ← Frontend (React)
│  hexsopedia     │     https://hexsopedia-xxx.vercel.app
└────────┬────────┘
         │ API Calls
         ↓
┌─────────────────┐
│  Render.com     │  ← Backend (Node.js/Express)
│  hexsopedia-    │     https://hexsopedia-backend.onrender.com
│  backend        │
└────────┬────────┘
         │ Database
         ↓
┌─────────────────┐
│ MongoDB Atlas   │  ← Database
│  (Cloud)        │     mongodb+srv://...
└─────────────────┘
```

---

## Important Notes

### Free Tier Limitations

**Render Free Tier:**
- Backend **spins down after 15 minutes** of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- 750 hours/month (enough for one service running 24/7)

**Solution for Cold Starts:**
- Use a service like https://uptimerobot.com to ping your backend every 14 minutes
- Or upgrade to Render paid plan ($7/month for always-on)

**Vercel Free Tier:**
- No cold starts
- Fast CDN
- 100GB bandwidth/month

**MongoDB Atlas Free Tier:**
- 512MB storage
- Perfect for personal projects

---

## Monitoring & Maintenance

### Check Backend Status
```bash
curl https://hexsopedia-backend.onrender.com
```

### View Backend Logs
1. Go to Render dashboard
2. Click on your service
3. View **"Logs"** tab

### View Frontend Logs
1. Go to Vercel dashboard
2. Click on your project
3. View **"Functions"** or **"Deployment"** logs

---

## Making Changes

### Update Frontend
```bash
# Make changes
git add .
git commit -m "Update frontend"
git push origin main

# Vercel auto-deploys!
```

### Update Backend
```bash
# Make changes to backend/
git add .
git commit -m "Update backend"
git push origin main

# Render auto-deploys!
```

---

## Cost Breakdown

| Service | Free Tier | Perfect For |
|---------|-----------|-------------|
| **Vercel** | 100GB bandwidth | Frontend hosting |
| **Render** | 750 hours/month | Backend API |
| **MongoDB Atlas** | 512MB storage | Database |
| **Total** | **$0/month** 🎉 | Personal projects |

---

## Next Steps

1. ✅ Backend deployed on Render
2. ✅ Frontend deployed on Vercel
3. ✅ MongoDB Atlas connected
4. 🎨 Add custom domain (optional)
5. 📊 Set up monitoring (UptimeRobot)
6. 🔒 Add security headers
7. 📧 Email notifications (future feature)

---

## Support

If you encounter any issues:
1. Check this guide
2. Review Render logs
3. Check Vercel deployment logs
4. Check browser console (F12)
5. Verify all environment variables

---

🚀 **Your Hexsopedia is now live on the internet!**

**Your URLs:**
- Frontend: `https://hexsopedia-xxxxx.vercel.app`
- Backend: `https://hexsopedia-backend.onrender.com`
- Database: MongoDB Atlas (cloud)
