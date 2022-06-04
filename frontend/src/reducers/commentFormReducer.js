import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isCommentError: false,
  loading: false,
  success: false
}

const commentFormSlice = createSlice({
  name: 'commentForm',
  initialState,
  reducers: {
    setIsComment(state, action) {
      let newState = state
      newState.isCommentError = action.payload
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

export const { setIsComment, setLoading, setSuccess } = commentFormSlice.actions
export default commentFormSlice.reducer