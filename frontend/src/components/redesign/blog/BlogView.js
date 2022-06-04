import * as React from 'react'

import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Container } from '@mui/material'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import { Box } from '@mui/system'
import FavoriteBorderSharpIcon from '@mui/icons-material/FavoriteBorderSharp'
import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp'
import DeleteOutlineSharpIcon from '@mui/icons-material/DeleteOutlineSharp'
import EditSharpIcon from '@mui/icons-material/EditSharp'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { pink, green } from '@mui/material/colors'
import CircularProgress from '@mui/material/CircularProgress'

import { setIsComment, setLoading, setSuccess } from '../../../reducers/commentFormReducer'
import { useDispatch, useSelector } from 'react-redux'

import { useMatch, useNavigate } from 'react-router-dom'

import { setUser } from '../../../reducers/userReducer'

import blogService from '../../../services/blogs'

import { setSuccessNotification, setErrorNotification } from '../../../reducers/notificationReducer'
import { setBlog, sendComment, deleteComment, deleteBlog } from '../../../reducers/blogReducer'

import tokenService from '../../../services/token'
import { logoutUser } from '../../../reducers/userReducer'
import { setInfoNotification } from '../../../reducers/notificationReducer'

const CommentList = ({ comments, user, blog }) => {
  const dispatch = useDispatch()

  if(comments?.length === 0){
    return <Typography
      sx={{ fontSize: 18 }}
    >
      There are no comments for this blog yet! Why not try adding some?
    </Typography>
  }

  const handleCommentDelete = async (id) => {
    if(window.confirm('Are you sure that you would like to delete this comment?')){
      try {
        await dispatch(deleteComment(id, blog))
        dispatch(setSuccessNotification('Comment successfully deleted'))
      } catch (err) {
        dispatch(setErrorNotification('Could not delete comment'))
      }
    }
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {
        comments?.reverse().map(c => (
          <>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={c.name} src={c.image} />
              </ListItemAvatar>
              <ListItemText
                primary={c.date}
                secondary={<React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {c.name} {' - '}
                  </Typography>
                  {c.comment}
                </React.Fragment>} />

              {
                user !== null && c.user.id === user.id &&
                <Tooltip title="Delete Comment">
                  <IconButton onClick={() => handleCommentDelete(c.id)} id={c.id} value={c.id}>
                    <DeleteOutlineSharpIcon />
                  </IconButton>
                </Tooltip>
              }

            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))
      }
    </List>
  )
}

export default function BlogView() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isCommentError = useSelector(state => state.commentForm.isCommentError)
  const match = useMatch('/blogs/:id')
  const user = useSelector(state => state.user)
  const success = useSelector(state => state.commentForm.success)
  const loading = useSelector(state => state.commentForm.loading)

  const post = useSelector(state => {
    let list = state.blogs.filter(s => s.id.toString() === match.params.id.toString())
    return list[0]
  })

  let data = {
    title: post?.title,
    content: post?.content,
    url: post?.url,
    author: post?.author,
    date: post?.createdAt.split('T')[0],
    comments: post?.comments.map(c => {
      return {
        name: c.user.name,
        date: c.createdAt.split('T')[0],
        comment: c.content,
        image: c.user.id === user?.id ? user.avatar : c.user.avatar,
        user: c.user,
        id: c.id
      }
    }),
    owner: user ? post?.user.id === user.id : false,
    like: user ? user.likes.includes(post?.id) : false
  }

  const loggedIn = user !== null

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      }
    }),
    width: '100%'
  }

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

    const content = {
      content: e.target.comment.value,
      blog: match.params.id
    }

    if(e.target.comment.value === '') {
      dispatch(setIsComment(false))
      dispatch(setErrorNotification('Please add content for the comment'))
      dispatch(setSuccess(false))
      dispatch(setLoading(false))

      dispatch(setIsComment(true))
    } else {
      try {
        await dispatch(sendComment(content, post))
        dispatch(setSuccessNotification('Comment added!'))
        dispatch(setSuccess(true))
        dispatch(setLoading(false))
        e.target.comment.value = ''
      } catch (err) {
        dispatch(setErrorNotification('Could not add comment'))
        dispatch(setSuccess(false))
        dispatch(setLoading(false))
      }

      setTimeout( () => {
        dispatch(setSuccess(false))
        dispatch(setLoading(false))
      }, 2000)
    }
  }

  const handleBlogDelete = async () => {
    if(window.confirm('Are you sure that you would like to delete this blog?')){
      try {
        await dispatch(deleteBlog(match.params.id, user.id))
        navigate('/')
        dispatch(setSuccessNotification('Blog successfully deleted'))
      } catch (err) {
        dispatch(setErrorNotification('Could not delete blog'))
      }
    }
  }

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
        avatar: newUser.avatar
      }))

      dispatch(setBlog({
        ...post, likes: update.likes
      }))

      dispatch(setSuccessNotification(message))
    } catch (err){
      dispatch(setErrorNotification('Could not like blog'))
    }
  }

  return (
    <Container sx={{ mb: '10%', mt: '1%' }}>
      <Box sx={{ mb: '2%' }}>
        <Typography variant="h3" component="div">
          {data.title}
        </Typography>

        <Typography sx={{ mb: 1 }}>
          {data.author} - {data.date}
        </Typography>

        <Divider sx={{ background: 'black', mb: '1%' }}/>

        <Typography sx={{ fontSize: 18 }}>
          { data.content }
          {
            data.url &&
            <>
              <br/>
              <br/>
              For more information go <a href={data.url} target='blank'>here</a>
            </>
          }
        </Typography>

        {
          loggedIn ? data.like ?
            <Tooltip title="Unlike"><IconButton id='unlike' onClick={() => handleLikeClick('unlike')}><FavoriteSharpIcon sx={{ color: pink[500] }} /></IconButton></Tooltip>
            :
            <Tooltip title="Like"><IconButton id='like' onClick={() => handleLikeClick('like')}><FavoriteBorderSharpIcon sx={{ color: pink[500] }} /></IconButton></Tooltip>
            : <></>
        }

        {
          loggedIn ? data.owner ?
            <>
              <Tooltip title="Delete Blog"><IconButton onClick={handleBlogDelete} ><DeleteOutlineSharpIcon/></IconButton></Tooltip>
              <Tooltip title="Edit Blog"><IconButton><EditSharpIcon/></IconButton></Tooltip>
            </>: <></> : <></>
        }

      </Box>

      <Box>
        <Typography variant="h4" component="div">Comments</Typography>
        <Divider sx={{ background: 'black', mb: '1%' }}/>
        {
          loggedIn ?
            <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', marginBottom: '1%', marginRight: '0%' }}>
              <TextField
                id="comment"
                label="Comment"
                variant="outlined"
                error={isCommentError}
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
                      /> : <>Add Comment</>
                    }
                  </Button>
                </Box>
              </Box>
            </form> : <></>
        }

        <CommentList comments={ data.comments } user={ user }  blog={ post }/>
      </Box>

    </Container>
  )
}