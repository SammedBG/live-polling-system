"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import socketService from "../services/socket"
import { setCurrentPoll, setResults, setError } from "../store/pollSlice"
import TeacherDashboard from "./TeacherDashboard"
import TeacherResults from "./TeacherResults"

const TeacherFlow = () => {
  const dispatch = useDispatch()
  const { currentPoll, results } = useSelector((state) => state.poll)
  const [view, setView] = useState("dashboard") // 'dashboard' or 'results'

  useEffect(() => {
    const socket = socketService.getSocket()

    socket.on("poll-created", (poll) => {
      dispatch(setCurrentPoll(poll))
      setView("results")
    })

    socket.on("poll-creation-error", (error) => {
      dispatch(setError(error))
    })

    socket.on("poll-results", (results) => {
      dispatch(setResults(results))
    })

    socket.on("poll-ended", (results) => {
      dispatch(setResults(results))
    })

    return () => {
      socket.off("poll-created")
      socket.off("poll-creation-error")
      socket.off("poll-results")
      socket.off("poll-ended")
    }
  }, [dispatch])

  const handleBackToDashboard = () => {
    setView("dashboard")
  }

  if (view === "results" && (currentPoll || results)) {
    return <TeacherResults onBack={handleBackToDashboard} />
  }

  return <TeacherDashboard />
}

export default TeacherFlow
