# Deploying Hexsopedia to Vercel

This guide will help you deploy your Hexsopedia application to Vercel with MongoDB Atlas.

## Prerequisites

- [Vercel Account](https://vercel.com/signup) (free)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas/register) (free)
- [GitHub Account](https://github.com) with your code pushed to a repository

## Part 1: Set Up MongoDB Atlas (Database)

### Step 1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign in or create a new account
3. Click **"Build a Database"**
4. Choose **FREE** tier (M0 Sandbox)
5. Select a cloud provider and region (closest to you)
6. Click **"Create Cluster"** (takes 3-5 minutes)

### Step 2: Create Database User

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter:
   - Username: `hexsopedia-user`
   - Password: Generate a secure password (save it!)
5. Set privileges to **"Read and write to any database"**
6. Click **"Add User"**

### Step 3: Allow Network Access

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### Step 4: Get Connection String

1. Click **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://hexsopedia-user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name: `hexsopedia` after `.net/`
   ```
   mongodb+srv://hexsopedia-user:yourpassword@cluster0.xxxxx.mongodb.net/hexsopedia?retryWrites=true&w=majority
   ```

## Part 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Easiest)

#### Step 1: Push Code to GitHub

```bash
# In your project root directory
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

#### Step 2: Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository (Hexsopedia)
4. Vercel will detect it's a monorepo

#### Step 3: Configure Build Settings

**Framework Preset:** Other

**Root Directory:** Leave blank or set to `./`

**Build Command:**
```bash
cd frontend && npm install && npm run build
```

**Output Directory:**
```
frontend/build
```

**Install Command:**
```bash
npm install && cd backend && npm install && cd ../frontend && npm install
```

#### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A random secure string (e.g., `your_super_secret_jwt_key_12345`) |
| `JWT_EXPIRE` | `7d` |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

Click **"Deploy"**

### Option B: Deploy via Vercel CLI

#### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy

```bash
# In your project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? hexsopedia
# - Directory? ./
```

#### Step 4: Add Environment Variables

```bash
vercel env add MONGODB_URI
# Paste your MongoDB connection string

vercel env add JWT_SECRET
# Enter a secure random string

vercel env add JWT_EXPIRE
# Enter: 7d

vercel env add NODE_ENV
# Enter: production
```

#### Step 5: Deploy to Production

```bash
vercel --prod
```

## Part 3: Update Frontend API URL

After deployment, update your frontend to use the correct API URL:

1. Get your Vercel URL (e.g., `https://hexsopedia.vercel.app`)
2. Update `frontend/src/App.js` or create an API configuration file

**Option 1:** Update fetch calls to use relative URLs (already done if using `/api/...`)

**Option 2:** Use environment variable in React:

Update `frontend/.env.production`:
```
REACT_APP_API_URL=https://your-vercel-url.vercel.app
```

Then use in code:
```javascript
const API_URL = process.env.REACT_APP_API_URL || '';
fetch(`${API_URL}/api/auth/login`, ...)
```

## Part 4: Configure Backend for Production

Update `backend/server.js` to handle CORS for your Vercel domain:

```javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://your-app-name.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

## Alternative: Separate Backend Deployment

Since Vercel is primarily for frontend, you might want to deploy backend separately:

### Deploy Backend to Render.com (Free)

1. Go to [Render.com](https://render.com)
2. Create a **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment:** Node
5. Add environment variables (same as above)
6. Deploy

Then update your frontend to point to the Render backend URL.

### Deploy Backend to Railway.app (Free)

1. Go to [Railway.app](https://railway.app)
2. Start a new project
3. Deploy from GitHub repo
4. Add environment variables
5. Railway will auto-detect Node.js and deploy

## Vercel Configuration for Monorepo

If you have issues, create `vercel.json` in the root:

```json
{
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-backend-url.com/api/$1"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## Recommended Architecture

**Option 1: All-in-One (Complex)**
- Deploy everything to Vercel (harder to configure)

**Option 2: Split Architecture (Recommended)**
- **Frontend:** Vercel (free, fast CDN)
- **Backend:** Render.com or Railway.app (free tier)
- **Database:** MongoDB Atlas (free tier)

## Testing Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Try registering a new user
3. Create an entry
4. Test search functionality
5. Check admin features

## Troubleshooting

### Issue: API calls failing

**Solution:** Check CORS settings in backend and ensure API URL is correct

### Issue: MongoDB connection error

**Solution:** 
- Verify connection string is correct
- Check IP whitelist includes 0.0.0.0/0
- Ensure password doesn't have special characters (or URL encode them)

### Issue: Build fails

**Solution:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify build command is correct

### Issue: Environment variables not working

**Solution:**
- Redeploy after adding environment variables
- For React, variables must start with `REACT_APP_`

## Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Update DNS records as instructed by Vercel

## Monitoring

- **Vercel Analytics:** Enable in project settings
- **MongoDB Atlas Monitoring:** Check database metrics
- **Error Tracking:** Consider adding Sentry

## Cost

- **Vercel:** Free tier includes:
  - 100GB bandwidth/month
  - Unlimited deployments
  - Serverless functions

- **MongoDB Atlas:** Free tier includes:
  - 512MB storage
  - Shared CPU
  - Perfect for small to medium apps

- **Total Cost:** $0 for personal projects! 🎉

## Next Steps

1. ✅ Set up MongoDB Atlas
2. ✅ Deploy to Vercel
3. ✅ Test all features
4. 📧 Set up email notifications (future)
5. 🔒 Add security headers
6. 📊 Enable analytics
7. 🎨 Add custom domain

## Security Checklist

- ✅ Change JWT_SECRET to a strong random string
- ✅ Use environment variables for all secrets
- ✅ Enable HTTPS (automatic on Vercel)
- ✅ Set up proper CORS
- ✅ Validate user input
- ✅ Use secure MongoDB connection

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas logs
3. Test locally first
4. Check browser console for errors

---

🚀 Your Hexsopedia app is now live on the internet!
