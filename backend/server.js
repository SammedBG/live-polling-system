const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.FRONTEND_URL, "https://live-polling-system-teal.vercel.app", /\.vercel\.app$/]
      : "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, "https://live-polling-system-teal.vercel.app", /\.vercel\.app$/]
    : "http://localhost:3000",
  credentials: true
}))
app.use(express.json())

// In-memory storage for polls and students
let currentPoll = null
const students = new Map() // studentId -> { name, socketId, hasAnswered }
const pollResults = new Map() // optionIndex -> count
const pollHistory = []
const chatMessages = [] // Store chat messages

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  // Student registration
  socket.on("register-student", (data) => {
    const { name } = data
    const studentId = socket.id

    students.set(studentId, {
      name,
      socketId: studentId,
      hasAnswered: false,
    })

    socket.emit("registration-success", { studentId })

    // Send current poll if exists and student hasn't answered
    if (currentPoll && !students.get(studentId)?.hasAnswered) {
      socket.emit("new-poll", currentPoll)
    }

    // Update teacher with student count
    io.emit("student-count-update", students.size)
  })

  // Teacher creates a new poll
  socket.on("create-poll", (pollData) => {
    // Only allow new poll if no current poll or all students answered
    const allAnswered = Array.from(students.values()).every((student) => student.hasAnswered)

    if (!currentPoll || allAnswered) {
      currentPoll = {
        ...pollData,
        id: Date.now(),
        startTime: Date.now(),
        timeLimit: pollData.timeLimit || 60000, // Use provided time limit or default to 60 seconds
      }

      // Reset student answer status
      students.forEach((student) => {
        student.hasAnswered = false
      })

      // Reset poll results
      pollResults.clear()
      pollData.options.forEach((_, index) => {
        pollResults.set(index, 0)
      })

      // Send poll to all students
      io.emit("new-poll", currentPoll)

      // Start timer for poll
      setTimeout(() => {
        if (currentPoll && currentPoll.id === pollData.id) {
          endCurrentPoll()
        }
      }, currentPoll.timeLimit)

      socket.emit("poll-created", currentPoll)
    } else {
      socket.emit("poll-creation-error", "Cannot create poll while students are still answering")
    }
  })

  // Student submits answer
  socket.on("submit-answer", (data) => {
    const { optionIndex } = data
    const studentId = socket.id
    const student = students.get(studentId)

    if (student && currentPoll && !student.hasAnswered) {
      student.hasAnswered = true

      // Update poll results
      const currentCount = pollResults.get(optionIndex) || 0
      pollResults.set(optionIndex, currentCount + 1)

      // Send updated results to everyone
      broadcastResults()

      // Check if all students have answered
      const allAnswered = Array.from(students.values()).every((s) => s.hasAnswered)
      if (allAnswered) {
        endCurrentPoll()
      }
    }
  })

  // Get current poll results
  socket.on("get-results", () => {
    if (currentPoll) {
      const results = generateResults()
      socket.emit("poll-results", results)
    }
  })

  // Teacher removes a student
  socket.on("remove-student", (data) => {
    const { studentId } = data
    if (students.has(studentId)) {
      const student = students.get(studentId)
      students.delete(studentId)
      
      // Notify the removed student
      io.to(studentId).emit("kicked-out", "You have been removed by the teacher")
      
      // Update student count
      io.emit("student-count-update", students.size)
      
      // If poll is active and this student had answered, update results
      if (currentPoll) {
        broadcastResults()
      }
    }
  })

  // Chat functionality
  socket.on("send-message", (data) => {
    const { message, senderName, senderType } = data
    const chatMessage = {
      id: Date.now(),
      message,
      senderName,
      senderType,
      timestamp: new Date().toISOString()
    }
    
    chatMessages.push(chatMessage)
    
    // Broadcast to all connected users
    io.emit("new-message", chatMessage)
  })

  // Get chat history
  socket.on("get-chat-history", () => {
    socket.emit("chat-history", chatMessages)
  })

  // Disconnect handling
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
    students.delete(socket.id)
    io.emit("student-count-update", students.size)
  })
})

function endCurrentPoll() {
  if (currentPoll) {
    const results = generateResults()

    // Add to history
    pollHistory.push({
      ...currentPoll,
      results,
      endTime: Date.now(),
    })

    // Broadcast final results
    io.emit("poll-ended", results)

    currentPoll = null
  }
}

function generateResults() {
  const totalVotes = Array.from(pollResults.values()).reduce((sum, count) => sum + count, 0)

  return {
    question: currentPoll?.question,
    options: currentPoll?.options.map((option, index) => ({
      text: option,
      votes: pollResults.get(index) || 0,
      percentage: totalVotes > 0 ? Math.round(((pollResults.get(index) || 0) / totalVotes) * 100) : 0,
    })),
    totalVotes,
    studentsAnswered: Array.from(students.values()).filter((s) => s.hasAnswered).length,
    totalStudents: students.size,
  }
}

function broadcastResults() {
  const results = generateResults()
  io.emit("poll-results", results)
}

// REST API endpoints
app.get("/api/poll-history", (req, res) => {
  res.json(pollHistory)
})

app.get("/api/current-poll", (req, res) => {
  if (currentPoll) {
    const results = generateResults()
    res.json({ poll: currentPoll, results })
  } else {
    res.json({ poll: null, results: null })
  }
})

app.get("/api/students", (req, res) => {
  const studentList = Array.from(students.entries()).map(([id, student]) => ({
    id,
    name: student.name,
    hasAnswered: student.hasAnswered
  }))
  res.json(studentList)
})

const PORT = process.env.PORT || 5000
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
