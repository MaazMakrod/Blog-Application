import * as React from 'react'
import { Link as ReactLink } from 'react-router-dom'

import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Container } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import { green } from '@mui/material/colors'

import { setLoading, setSuccess, setIsUsername, setIsPassword } from '../../../reducers/loginFormReducer'
import { setErrorNotification, setSuccessNotification } from '../../../reducers/notificationReducer'
import { useSelector, useDispatch } from 'react-redux'

import { loginUser } from '../../../reducers/userReducer'

import { useNavigate } from 'react-router-dom'

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

export default function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isUsernameError = useSelector(state => state.loginForm.isUsernameError)
  const isPasswordError = useSelector(state => state.loginForm.isPasswordError)
  const loading = useSelector(state => state.loginForm.loading)
  const success = useSelector(state => state.loginForm.success)

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      }
    }),
    width: '30%',
    marginBottom: {
      xs: 2,
      md: 3,
      lg: 4,
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(setSuccess(false))
    dispatch(setLoading(true))

    const credentials = {
      username: e.target.username.value,
      password: e.target.password.value
    }

    try {
      await dispatch(loginUser(credentials))
      dispatch(setSuccess(false))
      dispatch(setLoading(false))
      navigate('/')
      dispatch(setSuccessNotification('Successfully logged in'))
    } catch (exception) {
      dispatch(setSuccess(false))
      dispatch(setLoading(false))
      dispatch(setIsUsername(true))
      dispatch(setIsPassword(true))
      dispatch(setErrorNotification('Username or password is incorrect'))
    }
  }

  const handleLoseFocus = (e) => {
    if(e.target.value === ''){
      if(e.target.id === 'username')
        dispatch(setIsUsername(true))
      else
        dispatch(setIsPassword(true))
    } else {
      if(e.target.id === 'username')
        dispatch(setIsUsername(false))
      else
        dispatch(setIsPassword(false))
    }
  }

  return (
    <Container sx={{ mt: '1%' }}>
      <Box sx={{ mb: '2%' }}>
        <Typography variant="h3" component="div">
          Login
        </Typography>

        <Divider sx={{ background: 'black', mb: '1%' }}/>
      </Box>

      <form onSubmit={handleSubmit}>
        <ValidationTextField
          onBlur={handleLoseFocus}
          label="Username"
          variant="outlined"
          id="username"
          error={isUsernameError}
          required
          helperText = 'Username is a required field'
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
          label="Password"
          variant="outlined"
          id="password"
          type = 'password'
          onBlur={handleLoseFocus}
          error={isPasswordError}
          helperText = 'Password is a required field'
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

        <br/>

        <Box sx={{ alignItems: 'center' }}>
          <Box>
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
                /> : <>Login</>
              }
            </Button>
          </Box>
        </Box>
      </form>

      <ReactLink to='/users/create' style={{ color: '#1976d2' }}>
        <Typography>Need an account? Sign up here!</Typography>
      </ReactLink>
    </Container>
  )
}