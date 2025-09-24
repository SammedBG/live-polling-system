import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  currentPoll: null,
  results: null,
  isLoading: false,
  error: null,
  timeRemaining: 0,
  hasAnswered: false,
  selectedOption: null,
  studentCount: 0,
}

const pollSlice = createSlice({
  name: "poll",
  initialState,
  reducers: {
    setCurrentPoll: (state, action) => {
      state.currentPoll = action.payload
      state.hasAnswered = false
      state.selectedOption = null
      state.timeRemaining = 60
      state.error = null
    },
    setResults: (state, action) => {
      state.results = action.payload
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload
    },
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload
    },
    setHasAnswered: (state, action) => {
      state.hasAnswered = action.payload
    },
    setStudentCount: (state, action) => {
      state.studentCount = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    clearPoll: (state) => {
      state.currentPoll = null
      state.results = null
      state.hasAnswered = false
      state.selectedOption = null
      state.timeRemaining = 0
      state.error = null
    },
  },
})

export const {
  setCurrentPoll,
  setResults,
  setTimeRemaining,
  setSelectedOption,
  setHasAnswered,
  setStudentCount,
  setError,
  setLoading,
  clearPoll,
} = pollSlice.actions

export default pollSlice.reducer
