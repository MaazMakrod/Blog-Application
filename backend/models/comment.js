const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema ({
	user : {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	content: {
		type: String,
		required: true
	},
	blog: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Blog'
	}
}, {
	timestamps: true
})

commentSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment