import * as React from 'react'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Container } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { green } from '@mui/material/colors'
import CircularProgress from '@mui/material/CircularProgress'

import { useDispatch, useSelector } from 'react-redux'
import { setIsTitle, setIsAuthor, setIsContent, setSuccess, setLoading } from '../../../reducers/creatBlogFormReducer'
import { setErrorNotification, setSuccessNotification } from '../../../reducers/notificationReducer'

import { useNavigate } from 'react-router-dom'

import { createBlog } from '../../../reducers/blogReducer'

import tokenService from '../../../services/token'
import { logoutUser, setUser } from '../../../reducers/userReducer'
import { setInfoNotification } from '../../../reducers/notificationReducer'

import validUrl from 'valid-url'

const ValidationTextField = styled(TextField)({
  '& input:valid + fieldset': {
    borderColor: 'green',
    borderWidth: 2,
  },
  '& input:valid:focus + fieldset': {
    borderLeftWidth: 6,
    padding: '4px !important', // override inline-style
  },
})

export default function CreateBlog() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isTitleError = useSelector(state => state.createBlogForm.isTitleError)
  const isAuthorError = useSelector(state => state.createBlogForm.isAuthorError)
  const isContentError = useSelector(state => state.createBlogForm.isContentError)
  const success = useSelector(state => state.createBlogForm.success)
  const loading = useSelector(state => state.createBlogForm.loading)

  React.useEffect(async () => {
    const getTokenValidity = async (testToken) => await tokenService.tokenValid(testToken)
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')

    if (loggedUserJSON && loggedUserJSON !== 'null') {
      const user = JSON.parse(loggedUserJSON)

      if(! (await getTokenValidity(user.token))) {
        dispatch(logoutUser())
        dispatch(setInfoNotification('We logged you out while you were away'))
      }
    } else {
      dispatch(setUser(null))
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(setSuccess(false))
    dispatch(setLoading(true))

    if(e.target.title.value === '' || e.target.author.value === '' || e.target.content.value === '') {
      dispatch(setErrorNotification('Please complete all required fields'))
      dispatch(setSuccess(false))
      dispatch(setLoading(false))
    } else if (e.target.url.value !== '' && !validUrl.isUri(e.target.url.value)){
      dispatch(setErrorNotification('Please enter a valid url'))
      dispatch(setSuccess(false))
      dispatch(setLoading(false))
    } else {
      const content = {
        content: e.target.content.value,
        author: e.target.author.value,
        title: e.target.title.value,
        url: e.target.url.value,
        likes: 0
      }

      try {
        await dispatch(createBlog(content))

        dispatch(setSuccessNotification('Created Blog'))

        dispatch(setSuccess(false))
        dispatch(setLoading(false))

        e.target.url.value = ''
        e.target.content.value = ''
        e.target.title.value = ''
        e.target.author.value = ''

        navigate('/')
      } catch (err) {

        dispatch(setErrorNotification('Could not create blog'))
        dispatch(setSuccess(false))
        dispatch(setLoading(false))
      }
    }
  }

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      }
    }),
    width: '30%'
  }

  const handleLoseFocus = (e) => {
    if(e.target.value === ''){
      if(e.target.id === 'content')
        dispatch(setIsContent(true))
      else if(e.target.id === 'title')
        dispatch(setIsTitle(true))
      else
        dispatch(setIsAuthor(true))
    } else {
      if(e.target.id === 'content')
        dispatch(setIsContent(false))
      else if(e.target.id === 'title')
        dispatch(setIsTitle(false))
      else
        dispatch(setIsAuthor(false))
    }
  }

  return (
    <Container sx={{ mt: '1%', mb: '10%' }}>
      <Box sx={{ mb: '2%' }}>
        <Typography variant="h3" component="div">
          Create Blog
        </Typography>

        <Divider sx={{ background: 'black', mb: '1%' }}/>
      </Box>

      <form onSubmit={handleSubmit}>
        <ValidationTextField
          onBlur={handleLoseFocus}
          label="Title"
          variant="outlined"
          id="title"
          error={isTitleError}
          required
          helperText = 'Title is a required field'
          sx = {{
            width: '75%',
            marginBottom: {
              xs: 2,
              md: 3,
              lg: 4
            }
          }}
        />

        <ValidationTextField
          label="Author"
          variant="outlined"
          id="author"
          onBlur={handleLoseFocus}
          error={isAuthorError}
          helperText = 'Author is a required field'
          required
          sx = {{
            width: '75%',
            marginBottom: {
              xs: 2,
              md: 3,
              lg: 4,
            }
          }}
        />

        <ValidationTextField
          label="Content"
          variant="outlined"
          id="content"
          onBlur={handleLoseFocus}
          error={isContentError}
          helperText = 'Content is a required field'
          required
          sx = {{
            width: '75%',
            marginBottom: {
              xs: 2,
              md: 3,
              lg: 4,
            }
          }}
        />

        <TextField
          label="URL"
          variant="outlined"
          id="url"
          helperText = 'URL is not a required field'
          sx = {{
            width: '75%',
            marginBottom: {
              xs: 2,
              md: 3,
              lg: 4,
            }
          }}
        />

        <br/>

        <Box sx={{ alignItems: 'center' }}>
          <Box >
            <Button
              variant="contained"
              sx={buttonSx}
              disabled={loading}
              type='submit'
            >
              {loading ?
                <CircularProgress
                  size={24}
                  sx={{
                    color: green[500],
                  }}
                /> : <>Create Blog</>
              }
            </Button>
          </Box>
        </Box>
      </form>
    </Container>
  )
}