import { useSelector } from "react-redux"

const PollResults = () => {
  const { results } = useSelector((state) => state.poll)

  if (!results) return null

  return (
    <div className="card">
      <h1 className="title">Poll Results</h1>
      <h2 className="subtitle">{results.question}</h2>

      <div className="poll-info">
        {results.studentsAnswered} of {results.totalStudents} students answered
      </div>

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
    </div>
  )
}

export default PollResults
