import * as React from 'react'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Link as ReactLink } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import { Container } from '@mui/system'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import { green } from '@mui/material/colors'
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
// import VisibilityIcon from '@mui/icons-material/Visibility'
// import IconButton from '@mui/material/IconButton'

import { setIsUsername, setIsPassword, setIsConfirmPassword, setIsName, setLoading, setSuccess } from '../../../reducers/createAccountFormReducer'
import { setSuccessNotification, setErrorNotification } from '../../../reducers/notificationReducer'

import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { createUser } from '../../../reducers/userReducer'

const ValidationTextField = styled(TextField)({
  '& input:valid + fieldset': {
    borderColor: 'green',
    borderWidth: 2,
  },
  '& input:valid:focus + fieldset': {
    borderLeftWidth: 6,
    padding: '4px !important', // override inline-style
  }
})

export default function CreateAccountForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isUsernameError = useSelector(state => state.createAccountForm.isUsernameError)
  const isPasswordError = useSelector(state => state.createAccountForm.isPasswordError)
  const isConfirmPasswordError = useSelector(state => state.createAccountForm.isConfirmPasswordError)
  const isNameError = useSelector(state => state.createAccountForm.isNameError)
  const loading = useSelector(state => state.createAccountForm.loading)
  const success = useSelector(state => state.createAccountForm.sucess)


  //   const [showPasswords, setShowPasswords] = React.useState(false)

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

    if(e.target.password.value === '' || e.target.confirmPassword.value === '' || e.target.name.value === '' || e.target.username.value === ''){
      dispatch(setErrorNotification('Please complete all fields'))
    } else if(e.target.password.value !== e.target.confirmPassword.value) {
      dispatch(setErrorNotification('Passwords do not match'))
      dispatch(setIsConfirmPassword(true))
      dispatch(setIsPassword(true))
    } else {
      const user = {
        username: e.target.username.value,
        password: e.target.password.value,
        name: e.target.name.value
      }

      try {
        await dispatch(createUser(user))
        dispatch(setSuccess(true))
        dispatch(setLoading(false))
        navigate('/')
        dispatch(setSuccessNotification('Successfully created account'))
      } catch (exception) {
        dispatch(setSuccess(false))
        dispatch(setLoading(false))
        dispatch(setIsUsername(true))
        dispatch(setErrorNotification('Username is taken'))
      }
    }

    dispatch(setSuccess(false))
    dispatch(setLoading(false))
  }

  //   const VisibilityButton = () => (
  //     <IconButton onClick={() => setShowPasswords(!showPasswords)}>
  //       { showPasswords ? <VisibilityOffIcon/> : <VisibilityIcon/>}
  //     </IconButton>
  //   )

  const handleLoseFocus = (e) => {
    if(e.target.value === ''){
      if(e.target.id === 'username')
        dispatch(setIsUsername(true))
      else if(e.target.id === 'name')
        dispatch(setIsName(true))
      else if(e.target.id === 'password')
        dispatch(setIsPassword(true))
      else
        dispatch(setIsConfirmPassword(true))
    } else {
      if(e.target.id === 'username')
        dispatch(setIsUsername(false))
      else if(e.target.id === 'name')
        dispatch(setIsName(false))
      else if(e.target.id === 'password')
        dispatch(setIsPassword(false))
      else
        dispatch(setIsConfirmPassword(false))
    }
  }

  return (
    <Container sx={{ mt: '1%', mb: '10%' }}>

      <Box sx={{ mb: '2%' }}>
        <Typography variant="h3" component="div">
          Create An Account
        </Typography>

        <Divider sx={{ background: 'black', mb: '1%' }}/>
      </Box>

      <form onSubmit={(e) => handleSubmit(e)}>
        <ValidationTextField
          onBlur={handleLoseFocus}
          label="Name"
          variant="outlined"
          id="name"
          error={isNameError}
          required
          helperText = 'Name is a required field'
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
          onBlur={handleLoseFocus}
          error={isPasswordError}
          type = 'password'
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

        <ValidationTextField
          label="Confirm Password"
          variant="outlined"
          id="confirmPassword"
          onBlur={handleLoseFocus}
          error={isConfirmPasswordError}
          type = 'password'
          helperText = 'Confirm password is a required field'
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
                /> : <>Create Account</>
              }
            </Button>
          </Box>
        </Box>

      </form>

      <ReactLink to='/users/login' style={{ color: '#1976d2' }}>
        <Typography>Back to login</Typography>
      </ReactLink>
    </Container>
  )
}