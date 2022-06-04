const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.post('/', async (request, response, next) => {
	const body = request.body
	const token = request.token
	const user = request.user

	if (!token || !user.id.toString()) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		content: body.content,
		user: user._id
	})

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

	const blogToReturn = await Blog.findById(savedBlog._id).populate('user').populate('comments').populate({ path: 'comments', populate: { path: 'user' } })

	response.json(blogToReturn)
})

blogRouter.put('/like/:id', async (request, response, next) => {
	const id  = request.params.id
	const blog = request.body
	const user = request.user
	const token = request.token

	if (!token || !user.id.toString()) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}

	let updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new:true })

	user.likes = user.likes.includes(updatedBlog._id) ?
		user.likes.filter(l => l._id.toString() !== updatedBlog._id.toString() ) :
		user.likes.concat(updatedBlog._id)

	await user.save()
	//const blogToReturn = await Blog.findById(id).populate('user').populate('comments')

	response.json(user)
})

blogRouter.put('/:id', async (request, response, next) => {
	const id  = request.params.id
	const blog = request.body
	const user = request.user
	const token = request.token

	if (!token || !user.id.toString()) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}

	let blogToUpdate = await Blog.findById(id)

	if(user.id.toString() !== blogToUpdate.user.toString()){
		return response.status(403).json({ error: 'You are not allowed to update this blog' })
	}

	await Blog.findByIdAndUpdate(id, blog, { new:true })
	const blogToReturn = await Blog.findById(id).populate('user').populate('comments').populate({ path: 'comments', populate: { path: 'user' } })

	response.json(blogToReturn)
})

blogRouter.delete('/:id', async (request, response, next) => {
	const id = request.params.id
	const token = request.token
	const blog = await Blog.findById(id)
	const user = request.user

	if (!token || !user.id.toString()) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}

	if(user.id.toString() !== blog.user.toString()){
		return response.status(403).json({ error: 'You are not allowed to delete this blog' })
	}

	await Blog.findByIdAndRemove(id)
	response.status(204).end()
})

module.exports = blogRouter