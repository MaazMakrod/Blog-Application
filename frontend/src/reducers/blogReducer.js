import blogService from '../services/blogs'
import { createSlice } from '@reduxjs/toolkit'
import commentService from '../services/comment'
import { removeUserBlog, addUserBlog } from './usersReducer'

const initialState = []

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action){
      state.push(action.payload)
    },
    removeBlog(state, action){
      const newState = state.filter (s => s.id !== action.payload)
      return newState
    },
    changeBlog(state, action){
      const newState = state.map(s => s.id === action.payload.id ? action.payload : s)
      return newState
    },
    setBlog(state, action){
      let newState = state.map(b => {
        if(b.id === action.payload.id)
          return action.payload
        return b
      })
      return newState
    },
    setBlogComments(state, action){
      let newState = state.map(b => {
        if(b.id.toString() === action.payload.id.toString()){
          return {
            ...b,
            comments: action.payload.comments
          }
        }
        return b
      })
      return newState
    }
  }
})

export const { setBlogs, appendBlog, removeBlog, changeBlog, setBlog, setBlogComments } = blogSlice.actions

export const createBlog = content => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    dispatch(appendBlog(newBlog))
    dispatch(addUserBlog({
      blog: newBlog,
      id: newBlog.user.id
    }))
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const deleteBlog = (id, id2) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch(removeBlog(id))
    dispatch(removeUserBlog({
      blogId: id,
      userId: id2
    }))
  }
}

export const updateBlog = (id, content) => {
  return async dispatch => {
    const updatedBlog = await blogService.update(id, content)
    dispatch(changeBlog(updatedBlog))
  }
}

export const sendComment = (content, blogToUpdate) => {
  return async dispatch => {
    const comment = await commentService.createComment(content)

    let dispatchContent = {
      id: blogToUpdate.id,
      comments: [...blogToUpdate.comments, comment]
    }

    dispatch(setBlogComments(dispatchContent))
  }
}

export const deleteComment = (id, blogToUpdate) => {
  return async dispatch => {
    await commentService.deleteComment(id)

    let dispatchContent = {
      id: blogToUpdate.id,
      comments: blogToUpdate.comments.filter(c => c.id !== id)
    }

    dispatch(setBlogComments(dispatchContent))
  }
}

export default blogSlice.reducer