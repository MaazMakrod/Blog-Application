import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isTitleError: false,
  isAuthorError: false,
  isContentError: false,
  success: false,
  loading: false
}

const editBlogFormSlice = createSlice({
  name: 'editBlogForm',
  initialState,
  reducers: {
    setIsTitle(state, action) {
      let newState = state
      newState.isTitleError = action.payload
      return newState
    },
    setIsAuthor(state, action) {
      let newState = state
      newState.isAuthorError = action.payload
      return newState
    },
    setIsContent(state, action) {
      let newState = state
      newState.isContentError = action.payload
      return newState
    },
    setSuccess(state, action) {
      let newState = state
      newState.success = action.payload
      return newState
    },
    setLoading(state, action) {
      let newState = state
      newState.loading = action.payload
      return newState
    }
  }
})

export const { setIsAuthor, setIsContent, setIsTitle, setLoading, setSuccess } = editBlogFormSlice.actions
export default editBlogFormSlice.reducer