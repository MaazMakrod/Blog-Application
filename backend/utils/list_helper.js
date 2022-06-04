const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	const reducer = (sum, item) => {
		return sum + item.likes
	}

	return blogs.length === 0
		? 0
		: blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
	const reducer = (current, check) => {
		return current.likes > check.likes ? current : check
	}

	return blogs.length === 0 ? null : blogs.length === 1 ? blogs[0] : blogs.reduce(reducer)
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog
}