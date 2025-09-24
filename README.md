# Live Polling System

A real-time polling system built with React frontend and Express.js + Socket.io backend.

## Features

### Teacher Features
- Create new polls with custom questions and multiple choice options
- **Configurable poll time limit (10-300 seconds)**
- View live polling results in real-time
- Can only ask new questions when no question is active or all students have answered
- See connected student count and response statistics
- **Manage students (view connected students and remove them)**
- **View complete poll history with detailed results**
- **Real-time chat with students**

### Student Features
- Enter name on first visit (unique to each browser tab)
- Submit answers once a question is asked
- View live polling results after submission
- **Configurable time limit to answer questions (set by teacher)**
- Automatic result display when time expires
- **Real-time chat with teacher and other students**
- **Get notified if removed by teacher**

## Technology Stack
- **Frontend**: React with Redux for state management
- **Backend**: Express.js with Socket.io for real-time communication
- **Language**: Pure JavaScript (no TypeScript)

## Project Structure

```
live-polling-system/
├── backend/
│   ├── server.js          # Express server with Socket.io
│   └── package.json       # Backend dependencies
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/     # React components
    │   ├── store/         # Redux store and slices
    │   ├── services/      # Socket.io service
    │   ├── App.js         # Main app component
    │   ├── index.js       # React entry point
    │   └── index.css      # Global styles
    └── package.json       # Frontend dependencies
```

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
  ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   
   The server will run on http://localhost:5000

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React app:
   ```bash
   npm start
   ```
   
   The app will run on http://localhost:3000

## How to Use

1. **Start both servers** (backend on port 5000, frontend on port 3000)

2. **Open the application** in your browser at http://localhost:3000

3. **Choose user type**:
   - Select "I'm Student" to join as a student
   - Select "I'm Teacher" to create and manage polls

4. **For Students**:
   - Enter your name to register
   - Wait for teacher to create a poll
   - Answer within 60 seconds when a question appears
   - View results after submitting or when time expires

5. **For Teachers**:
   - Create polls with questions and multiple choice options
   - View live results as students answer
   - Create new polls only when previous poll is complete

## Key Features Implemented

- ✅ Real-time communication using Socket.io
- ✅ **Configurable timer for student responses (10-300 seconds)**
- ✅ Live result updates with percentages and vote counts
- ✅ Student registration with unique names per tab
- ✅ Teacher poll creation with validation
- ✅ **Student management (view and remove students)**
- ✅ **Complete poll history with detailed results**
- ✅ **Real-time chat system for teacher-student interaction**
- ✅ Responsive design for mobile and desktop
- ✅ Redux state management for complex app state
- ✅ Proper error handling and user feedback
- ✅ **Docker containerization for easy deployment**
- ✅ **Production-ready deployment configuration**

## Technical Implementation

### Real-time Communication
- Socket.io handles all real-time features
- Events: `register-student`, `create-poll`, `submit-answer`, `poll-results`, `send-message`, `remove-student`
- Automatic cleanup on disconnect
- **Chat system with message history**
- **Student removal notifications**

### State Management
- Redux with Redux Toolkit for predictable state updates
- Separate slices for user and poll state
- Real-time updates through socket event listeners

### Timer System
- **Configurable timer (10-300 seconds) set by teacher**
- Client-side countdown with server-side validation
- Automatic submission when time expires
- Visual feedback with remaining time display

### Validation & Error Handling
- Form validation for poll creation and student registration
- Error messages for invalid actions
- Graceful handling of network issues

## Deployment

### Local Development
```bash
# Backend
cd backend
npm install
npm start

# Frontend (in another terminal)
cd frontend
npm install
npm start

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Production Deployment

#### Deploy to Render + Vercel
```bash
# 1. Deploy backend to Render
# Go to https://dashboard.render.com/
# Create new Web Service with root directory: backend

# 2. Deploy frontend to Vercel  
# Go to https://vercel.com/dashboard
# Import repo with root directory: frontend
# Set environment variable: REACT_APP_BACKEND_URL=https://your-render-url.onrender.com
```

**Quick Setup**: See [setup-deployment.md](setup-deployment.md) for 5-minute deployment guide

**Detailed Guide**: See [RENDER_VERCEL_DEPLOYMENT.md](RENDER_VERCEL_DEPLOYMENT.md) for complete instructions

#### Other Deployment Options
See [DEPLOYMENT.md](DEPLOYMENT.md) for additional deployment methods:
- Docker containerization
- Cloud platform deployment (Heroku, Railway)
- VPS deployment with Nginx
- SSL/HTTPS setup
- Monitoring and scaling
