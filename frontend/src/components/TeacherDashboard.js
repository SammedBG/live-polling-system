"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import socketService from "../services/socket"
import StudentManagement from "./StudentManagement"
import PollHistoryModal from "./PollHistoryModal"

const TeacherDashboard = () => {
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState(["", "", "", ""])
  const [timeLimit, setTimeLimit] = useState(60) // Default 60 seconds
  const [error, setError] = useState("")
  const [showStudentManagement, setShowStudentManagement] = useState(false)
  const [showPollHistory, setShowPollHistory] = useState(false)
  const { studentCount } = useSelector((state) => state.poll)

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""])
    }
  }

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index)
      setOptions(newOptions)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!question.trim()) {
      setError("Please enter a question")
      return
    }

    const validOptions = options.filter((option) => option.trim() !== "")
    if (validOptions.length < 2) {
      setError("Please provide at least 2 options")
      return
    }

    const socket = socketService.getSocket()
    socket.emit("create-poll", {
      question: question.trim(),
      options: validOptions,
      timeLimit: timeLimit * 1000, // Convert to milliseconds
    })

    setError("")
  }

  const resetForm = () => {
    setQuestion("")
    setOptions(["", "", "", ""])
    setTimeLimit(60)
    setError("")
  }

  const handleShowPollHistory = () => {
    setShowPollHistory(true)
  }

  return (
    <div className="card">
      <h1 className="title">Intervue Poll</h1>
      <p className="welcome-text">Hey There, how can I help you?</p>

      <div className="student-count">Connected Students: {studentCount}</div>

      <form onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="question"
            style={{ display: "block", marginBottom: "12px", fontWeight: "600", color: "#373737" }}
          >
            Question
          </label>
          <textarea
            id="question"
            className="textarea"
            placeholder="Which planet is known as the Red Planet?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={500}
          />
        </div>

        <div style={{ marginTop: "24px" }}>
          <label
            htmlFor="timeLimit"
            style={{ display: "block", marginBottom: "12px", fontWeight: "600", color: "#373737" }}
          >
            Time Limit (seconds)
          </label>
          <input
            id="timeLimit"
            type="number"
            className="input"
            placeholder="60"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Math.max(10, Math.min(300, parseInt(e.target.value) || 60)))}
            min="10"
            max="300"
            style={{ width: "100px" }}
          />
        </div>

        <div style={{ marginTop: "24px" }}>
          <label style={{ display: "block", marginBottom: "12px", fontWeight: "600", color: "#373737" }}>Options</label>

          {options.map((option, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
              <input
                type="text"
                className="input"
                placeholder={
                  index === 0 ? "Mars" : index === 1 ? "Jupiter" : index === 2 ? "Saturn" : `Option ${index + 1}`
                }
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                maxLength={200}
                style={{ margin: "0", flex: "1" }}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  style={{
                    marginLeft: "12px",
                    padding: "8px 12px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {options.length < 6 && (
            <button type="button" onClick={addOption} className="button secondary" style={{ marginTop: "12px" }}>
              Add More option
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <button type="submit" className="button">
            Ask Question
          </button>
          <button type="button" onClick={handleShowPollHistory} className="button secondary">
            View Poll History
          </button>
          <button type="button" onClick={() => setShowStudentManagement(true)} className="button secondary">
            Manage Students
          </button>
        </div>
      </form>
      
      {showStudentManagement && (
        <StudentManagement onClose={() => setShowStudentManagement(false)} />
      )}
      
      {showPollHistory && (
        <PollHistoryModal onClose={() => setShowPollHistory(false)} />
      )}
    </div>
  )
}

export default TeacherDashboard
