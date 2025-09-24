# Deployment Guide

This guide covers different deployment options for the Live Polling System.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- A hosting service (for production deployment)

## Local Development

### Option 1: Docker Compose (Recommended)

1. Clone the repository
2. Run the following command in the project root:
   ```bash
   docker-compose up --build
   ```
3. Access the application at:
   - Frontend: http://localhost
   - Backend API: http://localhost:5000

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
npm install
npm start
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Production Deployment

### Option 1: Docker Compose on VPS

1. **Prepare your server:**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Deploy the application:**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd live-polling-system
   
   # Update environment variables for production
   cp env.example .env
   # Edit .env file with your production settings
   
   # Start the application
   docker-compose up -d --build
   ```

3. **Configure reverse proxy (optional):**
   ```bash
   # Install Nginx
   sudo apt install nginx
   
   # Create configuration
   sudo nano /etc/nginx/sites-available/live-polling
   ```
   
   Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:80;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

### Option 2: Cloud Platform Deployment

#### Heroku

1. **Backend Deployment:**
   ```bash
   cd backend
   heroku create your-app-backend
   git subtree push --prefix backend heroku main
   ```

2. **Frontend Deployment:**
   ```bash
   cd frontend
   # Update REACT_APP_BACKEND_URL in package.json or environment
   heroku create your-app-frontend
   git subtree push --prefix frontend heroku main
   ```

#### Vercel (Frontend) + Railway (Backend)

1. **Deploy Backend to Railway:**
   - Connect your GitHub repository
   - Set root directory to `backend`
   - Deploy

2. **Deploy Frontend to Vercel:**
   - Connect your GitHub repository
   - Set root directory to `frontend`
   - Add environment variable: `REACT_APP_BACKEND_URL=https://your-railway-backend-url`

#### DigitalOcean App Platform

1. Create a new app
2. Connect your GitHub repository
3. Configure build settings:
   - Frontend: Build command `npm run build`, Output directory `build`
   - Backend: Build command `npm start`, Source directory `backend`

### Option 3: Traditional VPS Deployment

1. **Server Setup:**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   sudo npm install -g pm2
   ```

2. **Backend Deployment:**
   ```bash
   cd backend
   npm install --production
   pm2 start server.js --name "polling-backend"
   pm2 save
   pm2 startup
   ```

3. **Frontend Deployment:**
   ```bash
   cd frontend
   npm install
   npm run build
   
   # Serve with a web server like Nginx
   sudo cp -r build/* /var/www/html/
   ```

## Environment Variables

Create a `.env` file in the project root:

```env
# Backend Configuration
NODE_ENV=production
PORT=5000

# Frontend Configuration
REACT_APP_BACKEND_URL=http://your-backend-url:5000
```

## SSL/HTTPS Setup

### Using Let's Encrypt with Nginx

1. Install Certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. Obtain SSL certificate:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. Auto-renewal:
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

## Monitoring and Maintenance

### Health Checks

The application includes health check endpoints:
- Backend: `GET /api/current-poll`
- Frontend: Available at root URL

### Logs

```bash
# Docker Compose logs
docker-compose logs -f

# PM2 logs (if using PM2)
pm2 logs polling-backend
```

### Updates

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

## Troubleshooting

### Common Issues

1. **Socket.io connection issues:**
   - Check CORS settings in backend
   - Verify REACT_APP_BACKEND_URL environment variable

2. **Port conflicts:**
   - Change ports in docker-compose.yml
   - Update environment variables accordingly

3. **Build failures:**
   - Check Node.js version compatibility
   - Clear npm cache: `npm cache clean --force`

### Performance Optimization

1. **Enable gzip compression in Nginx:**
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
   ```

2. **Set up caching headers:**
   ```nginx
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

## Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files
   - Use secure random values for production

2. **CORS Configuration:**
   - Restrict origins in production
   - Update CORS settings in backend/server.js

3. **Rate Limiting:**
   - Consider implementing rate limiting for API endpoints
   - Use services like Cloudflare for DDoS protection

4. **Database:**
   - For production, consider using a persistent database
   - Current implementation uses in-memory storage

## Scaling

For high-traffic scenarios:

1. **Load Balancing:**
   - Use multiple backend instances
   - Implement sticky sessions for Socket.io

2. **Database:**
   - Migrate to Redis or PostgreSQL
   - Implement proper data persistence

3. **CDN:**
   - Use CloudFront or similar for static assets
   - Implement edge caching
