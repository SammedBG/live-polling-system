"use client"

import { useState, useEffect } from "react"

const PollHistoryModal = ({ onClose }) => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/poll-history')
      const pollHistory = await response.json()
      setHistory(pollHistory)
    } catch (error) {
      console.error('Error fetching poll history:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h2>Poll History</h2>
          <p>Loading history...</p>
          <button onClick={onClose} className="button secondary">Close</button>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '700px' }}>
        <h2>Poll History</h2>
        
        {history.length === 0 ? (
          <p>No poll history available</p>
        ) : (
          <div className="history-list">
            {history.map((poll, index) => (
              <div key={poll.id} className="history-item">
                <div className="history-header">
                  <h3>{poll.question}</h3>
                  <span className="history-date">
                    {formatDate(poll.endTime || poll.startTime)}
                  </span>
                </div>
                
                <div className="history-stats">
                  <span>Total Votes: {poll.results?.totalVotes || 0}</span>
                  <span>Students: {poll.results?.totalStudents || 0}</span>
                </div>
                
                {poll.results && (
                  <div className="history-results">
                    {poll.results.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="history-option">
                        <div className="history-option-text">
                          {String.fromCharCode(65 + optionIndex)}. {option.text}
                        </div>
                        <div className="history-option-bar">
                          <div 
                            className="history-option-fill" 
                            style={{ width: `${option.percentage}%` }}
                          ></div>
                        </div>
                        <div className="history-option-stats">
                          {option.votes} votes ({option.percentage}%)
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button onClick={fetchHistory} className="button secondary">
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

export default PollHistoryModal
