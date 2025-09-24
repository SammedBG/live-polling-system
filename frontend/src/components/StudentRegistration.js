"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import socketService from "../services/socket"
import { setStudentName } from "../store/userSlice"

const StudentRegistration = () => {
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Please enter your name")
      return
    }

    const socket = socketService.getSocket()
    socket.emit("register-student", { name: name.trim() })
    dispatch(setStudentName(name.trim()))
    setError("")
  }

  return (
    <div className="card">
      <h1 className="title">Intervue Poll</h1>
      <p className="welcome-text">
        Submit answers and participate in the live polling system to see how your responses compare with your classmates
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="input"
          placeholder="Rahul Bajaj"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
        />

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="button">
          Continue
        </button>
      </form>
    </div>
  )
}

export default StudentRegistration
