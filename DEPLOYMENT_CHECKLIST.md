# 🚀 Deployment Checklist

## Pre-Deployment
- [ ] Code committed to GitHub repository
- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] README updated with deployment info

## Backend (Render)
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Set service configuration:
  - [ ] Name: `live-polling-backend`
  - [ ] Environment: `Node`
  - [ ] Root Directory: `backend`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
- [ ] Add environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=10000`
- [ ] Deploy and get service URL
- [ ] Test API endpoints:
  - [ ] `GET /api/current-poll`
  - [ ] `GET /api/poll-history`
  - [ ] `GET /api/students`

## Frontend (Vercel)
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set project configuration:
  - [ ] Framework: `Create React App`
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `build`
- [ ] Add environment variable:
  - [ ] `REACT_APP_BACKEND_URL=https://your-render-backend.onrender.com`
- [ ] Deploy and get deployment URL

## Post-Deployment
- [ ] Update backend CORS with Vercel URL:
  - [ ] Add `FRONTEND_URL=https://your-vercel-app.vercel.app` to Render
  - [ ] Redeploy backend service
- [ ] Test full application:
  - [ ] Open Vercel URL in browser
  - [ ] Create poll as teacher
  - [ ] Join as student in another tab
  - [ ] Test real-time features
  - [ ] Test chat functionality
  - [ ] Test student management
  - [ ] Test poll history
- [ ] Verify all features work:
  - [ ] Poll creation with custom time limits
  - [ ] Real-time result updates
  - [ ] Student registration and removal
  - [ ] Chat system
  - [ ] Poll history viewing
  - [ ] Responsive design on mobile

## Production Optimization
- [ ] Set up custom domain (optional)
- [ ] Configure SSL certificates
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy
- [ ] Document production URLs
- [ ] Share deployment with team

## Troubleshooting
- [ ] Check Render logs for backend issues
- [ ] Check Vercel logs for frontend issues
- [ ] Verify environment variables are set correctly
- [ ] Test API endpoints directly
- [ ] Check browser console for errors
- [ ] Verify CORS configuration

## Success Criteria
- [ ] Application loads without errors
- [ ] All core features work in production
- [ ] Real-time communication functions properly
- [ ] Mobile responsive design works
- [ ] Performance is acceptable
- [ ] No console errors in browser
- [ ] API endpoints respond correctly

## Post-Launch
- [ ] Monitor application performance
- [ ] Set up uptime monitoring
- [ ] Plan for scaling if needed
- [ ] Document any issues encountered
- [ ] Share success with team
- [ ] Plan future improvements
