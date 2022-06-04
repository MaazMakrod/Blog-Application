import loginService from '../services/login'
import { createSlice } from '@reduxjs/toolkit'
import tokenService from '../services/token'
import userService from '../services/user'
import { initializeUsers, setUsers } from '../reducers/usersReducer'

const initialState = null

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(action.payload))
      return action.payload
    },
    removeUser(state, action){
      return action.payload
    }
  }
})

export const { setUser, removeUser } = userSlice.actions

export const loginUser = (credentials) => {
  return async dispatch => {
    const user = await loginService.login(credentials)
    tokenService.setToken(user.token)
    dispatch(setUser(user))
    dispatch(initializeUsers())
  }
}

export const logoutUser = () => {
  return async dispatch => {
    window.localStorage.removeItem('loggedBlogUser')
    dispatch(removeUser(null))
    dispatch(setUsers(null))
  }
}

export const createUser = content => {
  return async dispatch => {
    await userService.createAccount(content)
    dispatch(loginUser({
      username: content.username,
      password: content.password
    }))
  }
}

export const refreshUser = () => {
  return async dispatch => {
    const user = await tokenService.refresh()
    tokenService.setToken(user.token)
    dispatch(setUser(user))
  }
}

export const updateUser = (avatar) => {
  return async dispatch => {
    const user = await userService.updateUserAvatar(avatar)
    dispatch(setUser( { ...user, token: tokenService.getToken() }))
  }
}

export const deleteUser = () => {
  return async dispatch => {
    await userService.deleteAccount()
    dispatch(logoutUser())
  }
}

export default userSlice.reducer