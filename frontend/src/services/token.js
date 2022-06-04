import axios from 'axios'
const baseUrl = '/api/refresh'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getToken = () => token

const refresh = async () => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, config)
  return response.data
}

const tokenValid = async (testToken) => {
  const config = {
    headers: { Authorization: testToken.includes('bearer') ? testToken : `bearer ${testToken}` },
  }

  try{
    await axios.get(baseUrl, config)
    return true
  } catch (err) {
    return false
  }
}

export default { setToken, getToken, refresh, tokenValid }