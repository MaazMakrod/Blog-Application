import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  anchorElNav: null,
  anchorElUser: null
}

const headerReducerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    setAnchorElNav(state, action) {
      let newState = state
      newState.anchorElNav = action.payload
      return newState
    },
    setAnchorElUser(state, action) {
      let newState = state
      newState.anchorElUser = action.payload
      return newState
    }
  }
})

export const { setIsLoggedIn, setAnchorElUser, setAnchorElNav } = headerReducerSlice.actions
export default headerReducerSlice.reducer