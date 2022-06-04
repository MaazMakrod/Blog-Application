import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isURLError: false,
  loading: false,
  success: false
}

const avatarFormSlice = createSlice({
  name: 'avatarForm',
  initialState,
  reducers: {
    setIsURL(state, action) {
      let newState = state
      newState.isURLError = action.payload
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

export const { setIsURL, setLoading, setSuccess } = avatarFormSlice.actions
export default avatarFormSlice.reducer