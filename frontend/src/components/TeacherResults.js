"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

const TeacherResults = ({ onBack }) => {
  const { currentPoll, results, studentCount } = useSelector((state) => state.poll)
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    if (currentPoll) {
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - currentPoll.startTime) / 1000)
        setTimeElapsed(elapsed)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentPoll])

  if (!currentPoll && !results) {
    return (
      <div className="card">
        <h1 className="title">No Active Poll</h1>
        <button onClick={onBack} className="button">
          Back to Dashboard
        </button>
      </div>
    )
  }

  const isActive = currentPoll && timeElapsed < 60
  const studentsAnswered = results?.studentsAnswered || 0

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 className="title" style={{ margin: 0 }}>
          Live Poll Results
        </h1>
        <button onClick={onBack} className="button secondary" style={{ width: "auto", padding: "8px 16px" }}>
          Back to Dashboard
        </button>
      </div>

      {isActive && <div className="timer">Time Elapsed: {timeElapsed}s / 60s</div>}

      <h2 className="subtitle">{currentPoll?.question || results?.question}</h2>

      <div className="poll-info">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <span>Students Connected: {studentCount}</span>
          <span>Students Answered: {studentsAnswered}</span>
        </div>

        {isActive ? (
          <div style={{ color: "#28a745", fontWeight: "600" }}>Poll is active - Students can still answer</div>
        ) : (
          <div style={{ color: "#dc3545", fontWeight: "600" }}>Poll has ended</div>
        )}
      </div>

      {results && (
        <div className="results-container">
          {results.options.map((option, index) => (
            <div key={index} className="result-item">
              <div className="result-option">
                {String.fromCharCode(65 + index)}. {option.text}
              </div>
              <div className="result-bar">
                <div className="result-fill" style={{ width: `${option.percentage}%` }}></div>
              </div>
              <div className="result-stats">
                <span>{option.votes} votes</span>
                <span>{option.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!results && isActive && <div className="waiting-message">Waiting for students to answer...</div>}
    </div>
  )
}

export default TeacherResults
