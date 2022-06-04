import axios from 'axios'
const baseUrl = '/api/comments'
import tokenService from './token'

const createComment = async (content) => {
  const config = {
    headers: { Authorization: tokenService.getToken() },
  }

  const request = await axios.post(baseUrl, content, config)
  return request.data
}

const deleteComment = async (id) => {
  const config = {
    headers: { Authorization: tokenService.getToken() },
  }

  const request = await axios.delete(`${baseUrl}/${id}`, config)
  return request.data
}

export default { createComment, deleteComment }