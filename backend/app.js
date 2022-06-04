const config = require('./utils/config')
const express = require('express')
require('express-async-errors')

const app = express()
const cors = require('cors')

const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const commentRouter = require('./controllers/comments')
const accountCreateRouter = require('./controllers/accountCreate')
const tokenRefreshRouter = require('./controllers/tokenRefresh')
const getBlogRouter = require('./controllers/getBlogs')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('connected to MongoDB')
	})
	.catch((error) => {
		logger.error('error connecting to MongoDB:', error.message)
	})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/create', accountCreateRouter)
app.use('/api/blogs', middleware.userExtractor, blogRouter)
app.use('/api/getblogs', getBlogRouter)
app.use('/api/users', middleware.userExtractor, usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/comments', middleware.userExtractor, commentRouter)
app.use('/api/refresh', middleware.userExtractor, tokenRefreshRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app