import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isUsernameError: false,
  isPasswordError: false,
  isConfirmPasswordError: false,
  isNameError: false,
  loading: false,
  success: false
}

const createAccountFormSlice = createSlice({
  name: 'createAccountForm',
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
    setIsConfirmPassword(state, action) {
      let newState = state
      newState.isConfirmPasswordError = action.payload
      return newState
    },
    setIsName(state, action) {
      let newState = state
      newState.isNameError = action.payload
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

export const { setIsPassword, setIsUsername, setIsConfirmPassword, setIsName, setLoading, setSuccess } = createAccountFormSlice.actions
export default createAccountFormSlice.reducer