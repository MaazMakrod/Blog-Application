import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isUsernameError: false,
  isPasswordError: false,
  loading: false,
  success: false
}

const loginFormSlice = createSlice({
  name: 'loginForm',
  initialState,
  reducers: {
    setIsUsername(state, action) {
      let newState = state
      newState.isUsernameError = action.payload
      return newState
    },
    setIsPassword(state, action) {
      let newState = state
      newState.isPasswordError = action.payload
      return newState
    },
    setLoading (state, action) {
      let newState = state
      newState.loading = action.payload
      return newState
    },
    setSuccess (state, action){
      let newState = state
      newState.success = action.payload
      return newState
    }
  }
})

export const { setIsPassword, setIsUsername, setLoading, setSuccess } = loginFormSlice.actions
export default loginFormSlice.reducer