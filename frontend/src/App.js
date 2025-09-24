"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import socketService from "./services/socket"
import UserSelection from "./components/UserSelection"
import StudentFlow from "./components/StudentFlow"
import TeacherFlow from "./components/TeacherFlow"
import Chat from "./components/Chat"
import { setCurrentPoll, setResults, setStudentCount, setHasAnswered } from "./store/pollSlice"

function App() {
  const dispatch = useDispatch()
  const { userType } = useSelector((state) => state.user)

  useEffect(() => {
    const socket = socketService.connect()

    // Listen for poll updates
    socket.on("new-poll", (poll) => {
      dispatch(setCurrentPoll(poll))
    })

    socket.on("poll-results", (results) => {
      dispatch(setResults(results))
    })

    socket.on("poll-ended", (results) => {
      dispatch(setResults(results))
      dispatch(setHasAnswered(true))
    })

    socket.on("student-count-update", (count) => {
      dispatch(setStudentCount(count))
    })

    return () => {
      socketService.disconnect()
    }
  }, [dispatch])

  const renderContent = () => {
    if (!userType) {
      return <UserSelection />
    }

    if (userType === "student") {
      return <StudentFlow />
    }

    if (userType === "teacher") {
      return <TeacherFlow />
    }

    return null
  }

  return (
    <div className="container">
      {renderContent()}
      {userType && <Chat />}
    </div>
  )
}

export default App
