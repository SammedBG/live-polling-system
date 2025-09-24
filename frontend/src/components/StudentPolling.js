"use client"

import { useState, useEffect, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import socketService from "../services/socket"
import { setTimeRemaining, setSelectedOption, setHasAnswered } from "../store/pollSlice"

const StudentPolling = () => {
  const dispatch = useDispatch()
  const { currentPoll, timeRemaining } = useSelector((state) => state.poll)
  const [localSelectedOption, setLocalSelectedOption] = useState(null)

  const handleSubmitAnswer = useCallback(() => {
    if (localSelectedOption !== null) {
      const socket = socketService.getSocket()
      socket.emit("submit-answer", { optionIndex: localSelectedOption })
      dispatch(setHasAnswered(true))
    }
  }, [localSelectedOption, dispatch])

  const handleOptionSelect = (optionIndex) => {
    setLocalSelectedOption(optionIndex)
    dispatch(setSelectedOption(optionIndex))
  }

  useEffect(() => {
    if (currentPoll) {
      // Start countdown timer
      const startTime = currentPoll.startTime
      const timeLimit = currentPoll.timeLimit

      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, Math.ceil((timeLimit - elapsed) / 1000))

        dispatch(setTimeRemaining(remaining))

        if (remaining === 0) {
          clearInterval(timer)
          // Auto-submit if time runs out
          if (localSelectedOption !== null) {
            handleSubmitAnswer()
          } else {
            dispatch(setHasAnswered(true))
          }
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentPoll, dispatch, localSelectedOption, handleSubmitAnswer])

  if (!currentPoll) return null

  return (
    <div className="card">
      <div className="question-number">Question 1</div>
      <div className="timer">00:{timeRemaining.toString().padStart(2, "0")}</div>

      <h2 className="question-text">{currentPoll.question}</h2>

      <div className="options-container">
        {currentPoll.options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${localSelectedOption === index ? "selected" : ""}`}
            onClick={() => handleOptionSelect(index)}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        className="button"
        onClick={handleSubmitAnswer}
        disabled={localSelectedOption === null || timeRemaining === 0}
      >
        Submit Answer
      </button>
    </div>
  )
}

export default StudentPolling
