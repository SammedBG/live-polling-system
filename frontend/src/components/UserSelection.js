"use client"
import { useDispatch } from "react-redux"
import { setUserType } from "../store/userSlice"

const UserSelection = () => {
  const dispatch = useDispatch()

  const handleUserTypeSelection = (type) => {
    dispatch(setUserType(type))
  }

  return (
    <div className="card">
      <h1 className="title">Intervue Poll</h1>
      <p className="welcome-text">Welcome to the Live Polling System</p>
      <h2 className="subtitle">Please select the role that best describes you in the system</h2>

      <button className="button" onClick={() => handleUserTypeSelection("student")}>
        I'm a Student
      </button>

      <button className="button secondary" onClick={() => handleUserTypeSelection("teacher")}>
        I'm a Teacher
      </button>

      <p className="welcome-text" style={{ marginTop: "24px", fontSize: "14px" }}>
        Let's Get Started
      </p>
    </div>
  )
}

export default UserSelection
