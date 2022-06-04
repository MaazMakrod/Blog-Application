import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import BookIcon from '@mui/icons-material/Book'
import LoginIcon from '@mui/icons-material/Login'

import { useSelector, useDispatch } from 'react-redux'
import { setAnchorElNav, setAnchorElUser } from '../../../reducers/headerReducer'

import { logoutUser } from '../../../reducers/userReducer'

const pages = [ { name: 'Blogs', link: '/', needUser: false } , { name: 'Users', link: '/users', needUser: true }]

import { Link as ReactLink } from 'react-router-dom'

import { useNavigate } from 'react-router-dom'
import { setSuccessNotification } from '../../../reducers/notificationReducer'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const anchorElNav = useSelector(state => state.header.anchorElNav)
  const anchorElUser = useSelector(state => state.header.anchorElUser)
  const user = useSelector(state => state.user)
  const isLoggedIn = user !== null

  const handleOpenNavMenu = (event) => {
    dispatch(setAnchorElNav(event.currentTarget))
  }
  const handleOpenUserMenu = (event) => {
    dispatch(setAnchorElUser(event.currentTarget))
  }

  const handleCloseNavMenu = () => {
    dispatch(setAnchorElNav(null))
  }

  const handleCloseUserMenu = () => {
    dispatch(setAnchorElUser(null))
  }

  const handleLogoutClick = () => {
    dispatch(setAnchorElUser(null))
    handleCloseUserMenu()
    dispatch(logoutUser())
    navigate('/')
    dispatch(setSuccessNotification('Successfully logged out'))
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar>
          <BookIcon sx={{ display: { xs: 'none', sm: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', sm: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            BLOG APP
          </Typography>

          <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', sm: 'none' }
              }}
            >
              {pages.map((page) => {
                if(page.needUser && isLoggedIn){
                  return (
                    <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                      <ReactLink style={{ textDecoration: 'none', color: 'blue' }} to={page.link}><Typography textAlign="center">{page.name}</Typography></ReactLink>
                    </MenuItem>
                  )
                } else if(page.needUser && !isLoggedIn) {
                  return null
                } else {
                  return (
                    <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                      <ReactLink style={{ textDecoration: 'none', color: 'blue' }} to={page.link}><Typography textAlign="center">{page.name}</Typography></ReactLink>
                    </MenuItem>
                  )
                }
              })}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' } }}>
            <BookIcon sx={{ display: { xs: 'flex', sm: 'none' }, mr: 1, mt: '1.5%' }} />

            <ReactLink to="/" style={{ textDecoration: 'none', color: 'white' }}>
              <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                sx={{
                  mr: 2,
                  display: { xs: 'flex', sm: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
            BLOG APP
              </Typography>
            </ReactLink>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
            {pages.map((page) => {
              if(page.needUser && isLoggedIn){
                return (
                  <ReactLink to={page.link} key={page.name} style={{ textDecoration: 'none' }}>
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      {page.name}
                    </Button>
                  </ReactLink>
                )
              } else if(page.needUser && !isLoggedIn) {
                return null
              } else {
                return (
                  <ReactLink to={page.link} key={page.name} style={{ textDecoration: 'none' }}>
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      {page.name}
                    </Button>
                  </ReactLink>
                )
              }
            })}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {
              isLoggedIn ?
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar src={user.avatar}/>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem>
                      <ReactLink to={`/users/${user.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                        <Typography textAlign="center">Account</Typography>
                      </ReactLink>
                    </MenuItem>
                    <MenuItem onClick={handleLogoutClick}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
                :
                <ReactLink to='/users/login' style={{ textDecoration: 'none' }}>
                  <Tooltip title="Login">
                    <IconButton sx={{ p: 0 }}>
                      <LoginIcon style={{ color: '#FFFFFF' }} fontSize='large' />
                    </IconButton>
                  </Tooltip>
                </ReactLink>
            }
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
