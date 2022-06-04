import axios from 'axios'
import tokenService from './token'

const baseUrl = '/api/users'

const createAccount = async (user) => {
  const response = await axios.post('/api/create', user)
  return response.data
}

const getAllUsers = async () => {
  const config = {
    headers: { Authorization: tokenService.getToken() },
  }

  const response = await axios.get(baseUrl, config)
  return response.data
}

const updateUserAvatar = async (avatar) => {
  const config = {
    headers: { Authorization: tokenService.getToken() },
  }

  const response = await axios.put(`${baseUrl}/avatar`, avatar, config)
  return response.data
}

const deleteAccount = async () => {
  const config = {
    headers: { Authorization: tokenService.getToken() },
  }

  const response = await axios.delete(baseUrl, config)
  return response.data
}

export default { createAccount, getAllUsers, updateUserAvatar, deleteAccount }