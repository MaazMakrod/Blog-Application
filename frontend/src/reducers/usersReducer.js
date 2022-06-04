import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/user'

const initialState = null

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
    addUserBlog(state, action) {
      let newState = state.map(u => {
        if(u.id === action.payload.id)
          return {
            ...u,
            blogs: [...u.blogs, action.payload.blog]
          }
        return u
      })
      return newState
    },
    removeUserBlog(state, action) {
      let newState = state.filter(u => {
        if(u.id === action.payload.userId) {
          const newBlogs = u.blogs.filter(b => {
            return b.id !== action.payload.blogId
          })
          return {
            ...u,
            blogs: [...newBlogs]
          }
        }
        return u
      })

      return newState
    }
  }
})

export const { setUsers, removeUser, removeUserBlog, addUserBlog } = userSlice.actions

export const initializeUsers = () => {
  return async dispatch => {
    const users = await userService.getAllUsers()
    dispatch(setUsers(users))
  }
}

export default userSlice.reducer