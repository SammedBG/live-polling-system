# Quick Deployment Setup

## 🚀 One-Click Deployment Steps

### 1. Backend (Render) - 5 minutes
1. Go to [Render](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Use these settings:
   ```
   Name: live-polling-backend
   Environment: Node
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```
5. Add environment variable:
   ```
   NODE_ENV=production
   ```
6. Click "Create Web Service"
7. **Copy the service URL** (e.g., `https://live-polling-backend.onrender.com`)

### 2. Frontend (Vercel) - 3 minutes
1. Go to [Vercel](https://vercel.com/dashboard)
2. Click "New Project"
3. Import GitHub repo
4. Use these settings:
   ```
   Framework: Create React App
   Root Directory: frontend
   ```
5. Add environment variable:
   ```
   REACT_APP_BACKEND_URL=https://your-render-backend-url.onrender.com
   ```
6. Click "Deploy"
7. **Copy the deployment URL** (e.g., `https://your-app.vercel.app`)

### 3. Update Backend CORS - 2 minutes
1. Go back to Render dashboard
2. Add environment variable:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
3. Redeploy the service

### 4. Test - 1 minute
1. Open your Vercel URL
2. Try creating a poll as teacher
3. Open another tab, join as student
4. Test chat and all features

## ✅ Done! Your app is live!

**Frontend**: https://your-app.vercel.app  
**Backend**: https://your-backend.onrender.com

## 🔧 Troubleshooting

**CORS Issues?**
- Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly
- Redeploy backend after adding environment variables

**Socket.io not working?**
- Check browser console for errors
- Verify both services are running
- Test API endpoints directly

**Need help?**
- Check the full guide: `RENDER_VERCEL_DEPLOYMENT.md`
- Render logs: Dashboard → Service → Logs
- Vercel logs: Dashboard → Project → Functions
