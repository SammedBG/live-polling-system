"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import socketService from "../services/socket"
import { setStudentId, setIsRegistered, setKickedOut } from "../store/userSlice"
import { setCurrentPoll, setSelectedOption, setHasAnswered } from "../store/pollSlice"
import StudentRegistration from "./StudentRegistration"
import StudentPolling from "./StudentPolling"
import StudentWaiting from "./StudentWaiting"
import PollResults from "./PollResults"
import KickedOut from "./KickedOut"

const StudentFlow = () => {
  const dispatch = useDispatch()
  const { isRegistered, isKickedOut } = useSelector((state) => state.user)
  const { currentPoll, hasAnswered, results } = useSelector((state) => state.poll)

  useEffect(() => {
    const socket = socketService.getSocket()

    socket.on("registration-success", (data) => {
      dispatch(setStudentId(data.studentId))
      dispatch(setIsRegistered(true))
    })

    socket.on("new-poll", (poll) => {
      dispatch(setCurrentPoll(poll))
      dispatch(setHasAnswered(false))
      dispatch(setSelectedOption(null))
    })

    socket.on("kicked-out", (message) => {
      dispatch(setKickedOut(true))
    })

    return () => {
      socket.off("registration-success")
      socket.off("new-poll")
      socket.off("kicked-out")
    }
  }, [dispatch])

  if (isKickedOut) {
    return <KickedOut />
  }

  if (!isRegistered) {
    return <StudentRegistration />
  }

  if (currentPoll && !hasAnswered) {
    return <StudentPolling />
  }

  if (results && hasAnswered) {
    return <PollResults />
  }

  return <StudentWaiting />
}

export default StudentFlow
