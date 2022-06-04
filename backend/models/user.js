const mongoose = require('mongoose')
require('mongoose-type-url')

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		minlength: 3
	},
	name: String,
	passwordHash: {
		type: String,
		minlength: 3
	},
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Blog'
		}
	],
	avatar: {
		type: mongoose.SchemaTypes.Url
	},
	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Blog'
		}
	],
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
}, {
	timestamps: true
})

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		// the passwordHash should not be revealed
		delete returnedObject.passwordHash
	}
})

const User = mongoose.model('User', userSchema)

module.exports = User