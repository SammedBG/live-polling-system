import { useSelector } from "react-redux"

const StudentWaiting = () => {
  const { studentName } = useSelector((state) => state.user)

  return (
    <div className="card">
      <h1 className="title">{studentName}</h1>
      <div className="waiting-message">Wait for the teacher to ask questions..</div>
    </div>
  )
}

export default StudentWaiting
