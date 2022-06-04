import axios from 'axios'
const baseUrl = '/api/blogs'
import tokenService from './token'

const getAll = () => {
  const request = axios.get('/api/getblogs')
  return request.then(response => response.data)
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: tokenService.getToken() },
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: tokenService.getToken() },
  }

  const response = await axios.delete(`${ baseUrl }/${id}`, config)
  return response.data
}

const update = async (id, newBlog) => {
  const config = {
    headers: { Authorization: tokenService.getToken() },
  }

  const response = await axios.put(`${ baseUrl }/${id}`, newBlog, config)
  return response.data
}

const likeBlog = async (blogId, blog) => {
  const config = {
    headers: { Authorization: tokenService.getToken() },
  }

  const response = await axios.put(`/api/blogs/like/${blogId}`, blog, config)
  return response.data
}

export default { getAll, create, update, remove, likeBlog }