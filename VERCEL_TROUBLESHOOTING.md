# Fix "Failed to Fetch" Error on Vercel

## Problem
Getting "Failed to fetch" error when trying to login/register on deployed Vercel app.

## Solution

### ✅ Step 1: Environment Variables in Vercel

Go to your Vercel Dashboard → Your Project → Settings → Environment Variables

**Make sure these are set:**

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://user:password@cluster.mongodb.net/hexsopedia?retryWrites=true&w=majority` | Production, Preview, Development |
| `JWT_SECRET` | `your_secret_key_here_make_it_random_and_long` | Production, Preview, Development |
| `JWT_EXPIRE` | `7d` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production, Preview, Development |
| `PORT` | `5000` | Production, Preview, Development |

**Important:** After adding/changing environment variables, you MUST redeploy!

### ✅ Step 2: Push Updated Code

```bash
git add .
git commit -m "Fix Vercel deployment - configure for all-in-one deployment"
git push origin main
```

Vercel will automatically redeploy.

### ✅ Step 3: Verify Deployment

1. Wait for deployment to complete (2-3 minutes)
2. Open your Vercel URL: `https://hexsopedia-xxx.vercel.app`
3. Open browser DevTools (F12) → Network tab
4. Try to login
5. Check the network request to `/api/auth/login`

### ✅ Step 4: Check Backend is Working

Visit your Vercel URL with `/api` path:
```
https://your-app.vercel.app/api
```

You should see:
```json
{"message": "Welcome to Hexsopedia API"}
```

If this doesn't work, there's an issue with the backend deployment.

---

## Common Issues & Solutions

### Issue 1: 404 on /api/* endpoints
**Cause:** Backend not deploying correctly
**Solution:**
1. Check Vercel deployment logs
2. Ensure `backend/package.json` exists with all dependencies
3. Make sure `vercel.json` routes are correct

### Issue 2: CORS Error
**Cause:** Backend rejecting requests from frontend
**Solution:**
- Environment variables not set in Vercel
- Redeploy after setting variables

### Issue 3: MongoDB Connection Error
**Cause:** MongoDB connection string incorrect
**Solution:**
1. Check MongoDB Atlas IP whitelist (should include `0.0.0.0/0`)
2. Verify connection string format
3. URL encode special characters in password
4. Make sure database name is included in connection string

### Issue 4: "Cannot find module" Error
**Cause:** Missing dependencies in backend
**Solution:**
Check `backend/package.json` includes all required dependencies:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "express-validator": "^7.0.1",
    "marked": "^9.1.6"
  }
}
```

---

## Vercel Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] MongoDB database user created
- [ ] MongoDB IP whitelist set to `0.0.0.0/0`
- [ ] All environment variables added in Vercel dashboard
- [ ] Code pushed to GitHub
- [ ] Vercel redeployed after environment variables added
- [ ] Backend API responding at `/api`
- [ ] No CORS errors in browser console
- [ ] Network tab shows successful API calls

---

## Testing Steps

1. **Test Backend:**
   ```
   https://your-app.vercel.app/api
   ```
   Should return: `{"message": "Welcome to Hexsopedia API"}`

2. **Test Registration:**
   - Go to Register page
   - Fill in details
   - Open DevTools → Network tab
   - Click Register
   - Check request to `/api/auth/register`

3. **Check for Errors:**
   - Open DevTools Console (F12)
   - Look for red error messages
   - Check Network tab for failed requests

---

## Get Deployment Logs

### In Vercel Dashboard:
1. Go to your project
2. Click on the latest deployment
3. Click "View Function Logs" or "Building"
4. Look for error messages

### Check specific function:
1. Go to "Functions" tab in Vercel
2. Click on `backend/server.js`
3. View real-time logs

---

## Alternative: Check if Backend is Accessible

Open a terminal and test your API:

```bash
# Test if backend is accessible
curl https://your-app.vercel.app/api

# Test registration endpoint
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"test123"}'
```

---

## Quick Debug

Add this to your browser console while on your app:

```javascript
// Test API connection
fetch(window.location.origin + '/api')
  .then(r => r.json())
  .then(d => console.log('Backend response:', d))
  .catch(e => console.error('Backend error:', e));
```

Should log: `Backend response: {message: "Welcome to Hexsopedia API"}`

If this fails, your backend isn't working on Vercel.

---

## Need More Help?

If still not working, please provide:
1. Your Vercel deployment URL
2. Screenshot of environment variables in Vercel (hide sensitive values)
3. Screenshot of browser DevTools → Network tab showing the failed request
4. Screenshot of Vercel deployment logs
