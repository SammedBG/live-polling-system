"use client"

import { useState, useEffect } from "react"
import socketService from "../services/socket"

const StudentManagement = ({ onClose }) => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      const studentList = await response.json()
      setStudents(studentList)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeStudent = (studentId) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      const socket = socketService.getSocket()
      socket.emit("remove-student", { studentId })
      // Refresh the list
      setTimeout(fetchStudents, 500)
    }
  }

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h2>Student Management</h2>
          <p>Loading students...</p>
          <button onClick={onClose} className="button secondary">Close</button>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Student Management</h2>
        <p>Connected Students: {students.length}</p>
        
        {students.length === 0 ? (
          <p>No students connected</p>
        ) : (
          <div className="student-list">
            {students.map((student) => (
              <div key={student.id} className="student-item">
                <div className="student-info">
                  <span className="student-name">{student.name}</span>
                  <span className={`student-status ${student.hasAnswered ? 'answered' : 'pending'}`}>
                    {student.hasAnswered ? 'Answered' : 'Pending'}
                  </span>
                </div>
                <button 
                  onClick={() => removeStudent(student.id)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button onClick={fetchStudents} className="button secondary">
            Refresh
          </button>
          <button onClick={onClose} className="button">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudentManagement
