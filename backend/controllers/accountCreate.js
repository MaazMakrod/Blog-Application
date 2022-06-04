const bcrypt = require('bcrypt')
const accountCreateRouter = require('express').Router()
const User = require('../models/user')

accountCreateRouter.post('/', async (request, response) => {
	const body = request.body

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(body.password, saltRounds)

	const avatarUrl = body.avatar ?? null

	const user = new User({
		username: body.username,
		name: body.name,
		passwordHash: passwordHash,
		avatar: avatarUrl
	})

	const savedUser = await user.save()

	response.json(savedUser)
})

module.exports = accountCreateRouter