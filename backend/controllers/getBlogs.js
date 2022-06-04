const getBlogRouter = require('express').Router()
const Blog = require('../models/blog')

getBlogRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user').populate('comments').populate({ path: 'comments', populate: { path: 'user' } })
	response.json(blogs)
})

module.exports = getBlogRouter