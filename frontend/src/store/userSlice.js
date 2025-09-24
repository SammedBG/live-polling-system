import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  userType: null, // 'student' or 'teacher'
  studentName: "",
  studentId: null,
  isRegistered: false,
  isKickedOut: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserType: (state, action) => {
      state.userType = action.payload
    },
    setStudentName: (state, action) => {
      state.studentName = action.payload
    },
    setStudentId: (state, action) => {
      state.studentId = action.payload
    },
    setIsRegistered: (state, action) => {
      state.isRegistered = action.payload
    },
    setKickedOut: (state, action) => {
      state.isKickedOut = action.payload
    },
    resetUser: (state) => {
      state.userType = null
      state.studentName = ""
      state.studentId = null
      state.isRegistered = false
      state.isKickedOut = false
    },
  },
})

export const { setUserType, setStudentName, setStudentId, setIsRegistered, setKickedOut, resetUser } = userSlice.actions

export default userSlice.reducer
