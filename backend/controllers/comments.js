const commentRouter = require('express').Router()
const Comment = require('../models/comment')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

commentRouter.get('/', async (request, response) => {
	const comments = await Comment.find({}).populate('user').populate('blog')
	response.json(comments)
})

commentRouter.post('/', async(request, response, next) => {
	const body = request.body
	const token = request.token
	const user = request.user

	if(!token || !user.id.toString()){
		return response.status(401).json({ error: 'token missing or invalid' })
	}

	const comment = new Comment({
		user: user._id,
		content: body.content,
		blog: body.blog
	})

	const savedComment = await comment.save()
	user.comments = user.comments.concat(savedComment._id)

	const blog = await Blog.findById(body.blog)
	blog.comments = blog.comments.concat(savedComment._id)

	await blog.save()
	await user.save()

	const commentToReturn = await Comment.findById(savedComment._id).populate('user').populate('blog')
	response.json(commentToReturn)
})

commentRouter.delete('/:id', async (request, response, next) => {
	const id = request.params.id
	const token = request.token
	const comment = await Comment.findById(id)
	const user = request.user

	if (!token || !user.id.toString()) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}

	if(user.id.toString() !== comment.user.toString()){
		return response.status(403).json({ error: 'You are not allowed to delete this comment' })
	}

	user.comments = user.comments.filter(c => c._id.toString() !== id)
	await user.save()

	const blog = await Blog.findById(comment.blog)
	blog.comments = blog.comments.filter(c => c._id.toString() !== id)
	await blog.save()

	//  await Comment.findByIdAndRemove(id)
	response.status(204).end()
})

module.exports = commentRouter