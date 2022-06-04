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
import { Link as ReactLink } from 'react-router-dom'

import { useSelector } from 'react-redux'

import { useDispatch } from 'react-redux'

import tokenService from '../../../services/token'
import { logoutUser, setUser } from '../../../reducers/userReducer'
import { setInfoNotification } from '../../../reducers/notificationReducer'

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

export default function AllUsers() {
  const users = useSelector(state => state.users)
  const dispatch = useDispatch()

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

  return (
    <Container sx={{ mt: '1%', mb: '10%' }}>
      <Typography variant="h3" component="div">
        Users
      </Typography>

      <Divider sx={{ background: 'black', mb: '1%' }}/>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>User</StyledTableCell>
              <StyledTableCell align="right">Blogs</StyledTableCell>
              <StyledTableCell align="right">Comments</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              users !== undefined &&
              users !== null &&
              users.map((user) => (
                <StyledTableRow key={user.id}>
                  <StyledTableCell component="th" scope="row">
                    <ReactLink to={ `${ user.id }` } style={{ color: '#1976d2' }}>{user.name}</ReactLink>
                  </StyledTableCell>
                  <StyledTableCell align="right">{user.blogs.length}</StyledTableCell>
                  <StyledTableCell align="right">{user.comments.length}</StyledTableCell>
                </StyledTableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}
