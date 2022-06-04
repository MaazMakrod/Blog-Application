import { createSlice } from '@reduxjs/toolkit'

const initialState = false

const loadingContentSlice = createSlice({
  name: 'contentLoaded',
  initialState,
  reducers: {
    setContentLoaded(state, action) {
      return action.payload
    }
  }
})

export const { setContentLoaded } = loadingContentSlice.actions

export default loadingContentSlice.reducer