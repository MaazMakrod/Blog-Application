const Blog = require('../models/blog')
const Comment = require('../models/comment')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
	const token = request.token
	const userId = request.user.id

	if (!token || !userId.toString()) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}

	const users = await User
		.find({}).populate('blogs').populate('likes').populate('comments')

	response.json(users)
})

usersRouter.put('/avatar', async (request, response, next) => {
	const user = request.body
	const token = request.token
	const userId = request.user.id

	if (!token || !userId.toString()) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}

	await User.findByIdAndUpdate(userId.toString(), user, { new:true })
	const userToReturn = await User.findById(userId).populate('comments').populate('blogs')

	response.json(userToReturn)
})

usersRouter.delete('/', async (request, response) => {
	const token = request.token
	const userId = request.user.id

	if (!token || !userId.toString()) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}

	await Blog.deleteMany({ user: userId })
	await Comment.deleteMany({ user: userId })
	await User.findByIdAndDelete(userId)

	response.status(204).end()
})

module.exports = usersRouter