import React, { useEffect } from 'react'

import LinearProgress from '@mui/material/LinearProgress'
import { Container } from '@mui/system'
import Typography from '@mui/material/Typography'

import Footer from './components/redesign/main/Footer'
import Header from './components/redesign/main/Header'

import CreateBlog from './components/redesign/blog/CreateBlog'
import BlogList from './components/redesign/blog/BlogList'
import BlogView from './components/redesign/blog/BlogView'
import EditBlog from './components/redesign/blog/EditBlog'

import LoginForm from './components/redesign/user/LoginForm'
import CreateAccountForm from './components/redesign/user/CreateAccountForm'
import UserView from './components/redesign/user/UserView'
import AllUsers from './components/redesign/user/AllUsers'

import tokenService from './services/token'

import { useDispatch, useSelector } from 'react-redux'

import { setUser, logoutUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { setContentLoaded } from './reducers/loadingContentReducer'

import { SuccessNotification, ErrorNotification, InfoNotification } from './components/redesign/notifications'
import { setInfoNotification } from './reducers/notificationReducer'

import {
  Routes,
  Route,
  // Navigate,
  // useParams,
  // useNavigate,
  // useMatch
} from 'react-router-dom'

const App = () => {

  const dispatch = useDispatch()
  const contentLoading = useSelector(state => state.contentLoading)

  useEffect(async () => {
    dispatch(setContentLoaded(false))
    const getTokenValidity = async (testToken) => await tokenService.tokenValid(testToken)
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')

    if (loggedUserJSON && loggedUserJSON !== 'null') {
      const user = JSON.parse(loggedUserJSON)

      if(await getTokenValidity(user.token)) {
        dispatch(setUser(user))
        tokenService.setToken(user.token)
        dispatch(initializeUsers())
      } else {
        dispatch(logoutUser())
        dispatch(setInfoNotification('We logged you out while you were away'))
      }
    } else {
      dispatch(setUser(null))
    }

    dispatch(initializeBlogs())
    dispatch(setContentLoaded(true))
  }, [])


  return (
    <>
      <Header/>
      <SuccessNotification />
      <ErrorNotification />
      <InfoNotification />

      {
        !contentLoading ?
          <Container sx={{ mb: '10%', mt: '1%', textAlign: 'center' }}>
            <Typography variant="h3" component="div" sx={{ mb: '1%' }}>
              Loading Content
            </Typography>
            <LinearProgress sx={{ mb: '1%' }}/>
          </ Container> :
          <Routes>
            <Route path='/' element={<BlogList />}></Route>
            <Route path='/blogs/create' element={<CreateBlog />}></Route>
            <Route path='/blogs/:id' element={<BlogView />}></Route>
            <Route path='/blogs/edit/:id' element={<EditBlog />}></Route>


            <Route path='/users' element={<AllUsers />}></Route>
            <Route path='/users/login' element={<LoginForm />}></Route>
            <Route path='/users/create' element={<CreateAccountForm />}></Route>
            <Route path='/users/:id' element={<UserView />}></Route>

          </Routes>

      }

      <Footer />
    </>
  )
}

export default App