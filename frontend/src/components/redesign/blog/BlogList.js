import * as React from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import FavoriteBorderSharpIcon from '@mui/icons-material/FavoriteBorderSharp'
import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp'
import DeleteOutlineSharpIcon from '@mui/icons-material/DeleteOutlineSharp'
import EditSharpIcon from '@mui/icons-material/EditSharp'
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp'
import { pink } from '@mui/material/colors'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { Container } from '@mui/system'
import Divider from '@mui/material/Divider'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

import { Link as ReactLink } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

import { setUser } from '../../../reducers/userReducer'
import blogService from '../../../services/blogs'
import { setSuccessNotification, setErrorNotification } from '../../../reducers/notificationReducer'
import { setBlog, deleteBlog } from '../../../reducers/blogReducer'

import tokenService from '../../../services/token'
import { logoutUser } from '../../../reducers/userReducer'
import { setInfoNotification } from '../../../reducers/notificationReducer'

const CardTemplate = ({ post, loggedIn, user }) => {
  const dispatch = useDispatch()

  const handleLikeClick = async (type) => {
    let update = {}
    let message = 'Unliked blog!'

    if(type === 'like') {
      update = { likes: post.likes + 1 }
      message = 'Liked blog!'

    }
    else
      update = { likes: post.likes - 1 }

    try {
      const newUser = await blogService.likeBlog(post.id, update)

      dispatch(setUser({
        token: user.token,
        username: newUser.username,
        name: newUser.name,
        id: newUser.id,
        likes: newUser.likes,
        comments: newUser.comments,
        avatar: newUser.avatar,
        blogs: newUser.blogs
      }))

      dispatch(setBlog({
        ...post, likes: update.likes
      }))

      dispatch(setSuccessNotification(message))
    } catch (err){
      dispatch(setErrorNotification('Could not like blog'))
    }
  }

  const handleDelete = async () => {
    if(window.confirm('Are you sure that you would like to delete this blog?')){
      try {
        await dispatch(deleteBlog(post.id, user.id))
        dispatch(setSuccessNotification('Blog successfully deleted'))
      } catch (err) {
        dispatch(setErrorNotification('Could not delete blog'))
      }
    }
  }

  return (
    <Grid item xs={ 10 } sm={ 5 } md={ 4 }>
      <Card sx={{ '&:hover': { boxShadow: 2 } }} variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {post.date}
          </Typography>
          <Typography variant="h5" component="div">
            {post.title}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {post.author}
          </Typography>
          <Typography variant="body2">
            {post.content}
          </Typography>
        </CardContent>
        <CardActions>
          <ReactLink to={ `/blogs/${ post.id }` }>
            <Tooltip title="View Blog">
              <IconButton>
                <VisibilitySharpIcon color="success" />
              </IconButton>
            </Tooltip>
          </ReactLink>
          {
            loggedIn ? post.like ?
              <Tooltip title="Unlike"><IconButton id='unlike' onClick={() => handleLikeClick('unlike')}><FavoriteSharpIcon sx={{ color: pink[500] }} /></IconButton></Tooltip>
              :
              <Tooltip title="Like"><IconButton id='like' onClick={() => handleLikeClick('like')}><FavoriteBorderSharpIcon sx={{ color: pink[500] }} /></IconButton></Tooltip>
              : <></>
          }
          {
            loggedIn ? post.owner ?
              <>
                <Tooltip title="Delete"><IconButton onClick={handleDelete}><DeleteOutlineSharpIcon /></IconButton></Tooltip>
                <ReactLink to={ `/blogs/edit/${post.id}` }><Tooltip title="Edit"><IconButton><EditSharpIcon/></IconButton></Tooltip></ReactLink>
              </> : <></> : <></>
          }
        </CardActions>
      </Card>
    </Grid>
  )
}

const BlogList = () => {
  const dispatch = useDispatch()

  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)

  const posts = blogs.map(b => {

    return {
      title: b.title,
      content: b.content.length > 35 ? b.content.slice(0, 35) + '...' : b.content,
      author: b.author,
      like: user ? user.likes.includes(b.id) : false,
      owner: user ? b.user.id === user.id : false,
      date: b.createdAt.split('T')[0],
      id: b.id,
      likes: b.likes,
      user: b.user,
      createdAt: b.createdAt,
      comments: b.comments
    }
  })

  const loggedIn = user !== null

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
    <Container sx={{ mb: '10%', mt: '1%' }}>
      <Box sx={{ mb: '2%' }}>
        <Typography variant="h3" component="div">
          Blogs

          {
            loggedIn ?
              <ReactLink to='/blogs/create'>
                <Tooltip title="Add Blog">
                  <IconButton>
                    <AddCircleOutlineIcon fontSize='large' color="primary"/>
                  </IconButton>
                </Tooltip>
              </ReactLink> : <></>
          }

        </Typography>

        <Divider sx={{ background: 'black', mb: '1%' }}/>
      </Box>

      <Box sx={{ width: '100%' }}>
        <Grid container justifyContent="center" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {
            posts.map(p =>
              <CardTemplate key={ p.id } post={p} loggedIn={ loggedIn } user={ user }/>
            )
          }
        </Grid>
      </Box>
    </Container>
  )
}

export default BlogList