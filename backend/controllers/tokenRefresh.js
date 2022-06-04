const jwt = require('jsonwebtoken')
const tokenRefreshRouter = require('express').Router()

tokenRefreshRouter.post('/', async (request, response) => {
	const token = request.token
	const user = request.user

	if(!token || !user.id.toString()){
		return response.status(401).json({ error: 'token missing or invalid' })
	}

	const userForToken = {
		username: user.username,
		id: user._id,
	}

	const newToken = jwt.sign(
		userForToken,
		process.env.SECRET,
		{ expiresIn: 60*60 }
	)

	response
		.status(200)
		.send({ token: newToken, username: user.username, name: user.name, id: user._id, likes: user.likes, comments: user.comments, avatar: user.avatar })
})

tokenRefreshRouter.get('/', async(request, response) => {
	const token = request.token
	if(!token) {
		let res = { tokenValid: false }
		return response.json(res)
	}

	let res = { tokenValid: true }
	return response.json(res)
})

module.exports = tokenRefreshRouter