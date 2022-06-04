import * as React from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Container } from '@mui/system'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import { green } from '@mui/material/colors'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { useMatch } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { setIsURL, setSuccess, setLoading } from '../../../reducers/userAvatarFormReducer'
import { setSuccessNotification, setErrorNotification } from '../../../reducers/notificationReducer'
import { updateUser } from '../../../reducers/userReducer'

import tokenService from '../../../services/token'
import { logoutUser, setUser, deleteUser } from '../../../reducers/userReducer'
import { setInfoNotification } from '../../../reducers/notificationReducer'

import { useNavigate } from 'react-router-dom'

import validUrl from 'valid-url'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: '#d3d3d3'
  }
}))

export default function UserView() {
  const match = useMatch('/users/:id')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const loading = useSelector(state => state.avatarForm.loading)
  const success = useSelector(state => state.avatarForm.success)
  const isURLError = useSelector(state => state.avatarForm.isURLError)

  const user = useSelector(state => {
    let list = state.users?.filter(s => s.id.toString() === match.params.id.toString())

    if(list === undefined)
      return null

    return list[0]
  })

  const storedUser = useSelector(state => state.user)

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

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      }
    }),
    width: '100%'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    dispatch(setSuccess(false))
    dispatch(setLoading(true))

    if(e.target.avatar.value === '') {
      dispatch(setErrorNotification('Please enter a url'))
      dispatch(setIsURL(true))
    } else if (!validUrl.isUri(e.target.avatar.value)){
      dispatch(setErrorNotification('Please enter a valid url'))
      dispatch(setIsURL(true))
    }

    let avatar = {
      avatar: e.target.avatar.value
    }

    try {
      await dispatch(updateUser(avatar))
      dispatch(setSuccess(true))
      dispatch(setLoading(false))
      dispatch(setSuccessNotification('Successfully changed avatar!'))
      e.target.avatar.value = ''
      setTimeout( () => {
        dispatch(setSuccess(false))
        dispatch(setLoading(false))
      }, 2000)
    } catch (err) {
      dispatch(setErrorNotification('Could not change avatar'))
      dispatch(setSuccess(false))
      dispatch(setLoading(false))
    }
  }

  const accountDelete = async (e) => {
    e.preventDefault()
    if(window.confirm('Are you sure you would like to delete your account?')){
      try {
        await dispatch(deleteUser())
        dispatch(setSuccessNotification('Account deleted!'))
        navigate('/')
      } catch (err) {
        dispatch(setErrorNotification('Could not delete account'))
      }
    }
  }

  return (
    <Container sx={{ mt: '1%', mb: '10%' }}>
      <Typography variant="h3" component="div">
        { user?.name }
      </Typography>

      <Divider sx={{ background: 'black', mb: '1%' }}/>

      {
        user?.blogs.length !== 0 ?
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Blog</StyledTableCell>
                  <StyledTableCell align="right">Likes</StyledTableCell>
                  <StyledTableCell align="right">Comments</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {user?.blogs.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {row.title}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.likes}</StyledTableCell>
                    <StyledTableCell align="right">{row.comments.length}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer> :
          <Typography sx={{ fontSize: 18 }}>
            {user?.name} has not added any blogs yet
          </Typography>
      }

      {
        storedUser?.id === user?.id &&
        <Box sx={{ mt: '1%' }}>
          <Typography variant="h4" component="div">Avatar URL</Typography>
          <Divider sx={{ background: 'black', mb: '1%' }}/>

          <Typography sx={{ fontSize: 18, mb: '1%' }}>
            Submit the link to your avatar to change your icon
          </Typography>

          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', marginBottom: '1%', marginRight: '0%' }}>
            <TextField
              id="avatar"
              label="Avatar URL"
              variant="outlined"
              error={isURLError}
              sx = {{
                width: '65%',
                marginRight: '5%'
              }}/>

            <Box sx={{ alignItems: 'center', width: '30%' }}>
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
                    /> : <>Change URL</>
                  }
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      }

      {
        storedUser?.id === user?.id &&
        <Box sx={{ mt: '1%' }}>
          <Typography variant="h4" component="div">Delete Account</Typography>
          <Divider sx={{ background: 'black', mb: '1%' }}/>

          <Typography sx={{ fontSize: 18, mb: '1%' }}>
            Click the button below to delete your account
          </Typography>

          <form onSubmit={accountDelete} style={{ display: 'flex', alignItems: 'center', marginBottom: '1%', marginRight: '0%' }}>
            <Box sx={{ alignItems: 'center', width: '30%' }}>
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
                    /> : <>Delete Account</>
                  }
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      }

    </Container>
  )
}
