# Deploy Live Polling System to Render + Vercel

This guide will help you deploy the Live Polling System with:
- **Backend**: Render (Node.js service)
- **Frontend**: Vercel (React app)

## Prerequisites

- GitHub repository with your code
- Render account (free tier available)
- Vercel account (free tier available)

## Step 1: Deploy Backend to Render

### 1.1 Create Render Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name**: `live-polling-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Environment Variables:**
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### 1.2 Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete (usually 2-3 minutes)
3. Note the service URL (e.g., `https://live-polling-backend.onrender.com`)

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:

**Project Settings:**
- **Framework Preset**: `Create React App`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

**Environment Variables:**
```
REACT_APP_BACKEND_URL=https://live-polling-backend.onrender.com
```

### 2.2 Deploy

1. Click "Deploy"
2. Wait for deployment to complete (usually 1-2 minutes)
3. Note the deployment URL (e.g., `https://your-app.vercel.app`)

## Step 3: Update Backend CORS Configuration

After getting your Vercel URL, update the backend:

1. Go to Render Dashboard → Your Service → Environment
2. Update the `FRONTEND_URL` environment variable with your actual Vercel URL
3. Redeploy the service

Or update the code directly:

```javascript
// In backend/server.js, update the CORS origin
origin: process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL, "https://your-actual-vercel-url.vercel.app"]
  : "http://localhost:3000",
```

## Step 4: Test Your Deployment

### 4.1 Test Backend
```bash
# Test health endpoint
curl https://your-render-backend.onrender.com/api/current-poll

# Test other endpoints
curl https://your-render-backend.onrender.com/api/poll-history
curl https://your-render-backend.onrender.com/api/students
```

### 4.2 Test Frontend
1. Open your Vercel URL in a browser
2. Try creating a poll as a teacher
3. Open another tab and join as a student
4. Test the chat functionality
5. Test student management features

## Step 5: Custom Domain (Optional)

### 5.1 Vercel Custom Domain
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### 5.2 Render Custom Domain
1. Go to Render Dashboard → Your Service → Settings → Custom Domains
2. Add your custom domain
3. Update DNS records as instructed

## Environment Variables Reference

### Backend (Render)
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Frontend (Vercel)
```
REACT_APP_BACKEND_URL=https://your-render-backend.onrender.com
```

## Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem**: Frontend can't connect to backend
**Solution**: 
- Verify `FRONTEND_URL` in Render environment variables
- Check that your Vercel URL is correctly set
- Ensure CORS configuration includes your Vercel domain

#### 2. Socket.io Connection Issues
**Problem**: Real-time features not working
**Solution**:
- Check that both services are deployed successfully
- Verify environment variables are set correctly
- Check browser console for connection errors

#### 3. Build Failures
**Problem**: Deployment fails during build
**Solution**:
- Check build logs in Render/Vercel dashboard
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

#### 4. Environment Variables Not Loading
**Problem**: App works locally but not in production
**Solution**:
- Double-check environment variable names
- Ensure variables are set in the correct service
- Redeploy after changing environment variables

### Debugging Steps

1. **Check Logs**:
   - Render: Service → Logs
   - Vercel: Project → Functions → View Function Logs

2. **Test API Endpoints**:
   ```bash
   # Test if backend is responding
   curl https://your-backend.onrender.com/api/current-poll
   ```

3. **Check Network Tab**:
   - Open browser dev tools
   - Check Network tab for failed requests
   - Look for CORS or connection errors

## Performance Optimization

### Render (Backend)
- **Free Tier**: 750 hours/month, sleeps after 15 minutes of inactivity
- **Paid Plans**: Always-on service, better performance
- **Scaling**: Auto-scaling available on paid plans

### Vercel (Frontend)
- **Free Tier**: 100GB bandwidth, unlimited deployments
- **Edge Network**: Global CDN for fast loading
- **Automatic HTTPS**: SSL certificates included

## Monitoring

### Render Monitoring
- Built-in metrics and logs
- Uptime monitoring
- Performance insights

### Vercel Monitoring
- Analytics dashboard
- Performance metrics
- Error tracking

## Cost Estimation

### Free Tier
- **Render**: 750 hours/month (sleeps when inactive)
- **Vercel**: 100GB bandwidth/month
- **Total**: $0/month (with limitations)

### Paid Plans
- **Render**: $7/month (always-on service)
- **Vercel**: $20/month (Pro plan)
- **Total**: ~$27/month (full features)

## Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **CORS**: Restrict origins to your domains only
3. **HTTPS**: Both services provide automatic SSL
4. **Rate Limiting**: Consider implementing for production use

## Backup and Recovery

### Code Backup
- GitHub repository serves as primary backup
- Regular commits ensure code safety

### Data Backup
- Current implementation uses in-memory storage
- For production, consider database integration
- Render provides database services

## Scaling Considerations

### High Traffic
- **Render**: Upgrade to paid plan for better performance
- **Vercel**: Pro plan includes better scaling
- **Database**: Consider external database for persistence

### Global Users
- **Vercel**: Global CDN automatically handles this
- **Render**: Choose region closest to users

## Support Resources

- **Render Documentation**: https://render.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **Socket.io Documentation**: https://socket.io/docs
- **React Documentation**: https://reactjs.org/docs

## Next Steps

1. **Monitor Performance**: Use built-in analytics
2. **Set Up Alerts**: Configure uptime monitoring
3. **Regular Updates**: Keep dependencies updated
4. **Database Integration**: For production data persistence
5. **Custom Domain**: For professional appearance
