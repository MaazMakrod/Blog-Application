import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'
import createBlogFormReducer  from './reducers/creatBlogFormReducer'
import editBlogFormReducer  from './reducers/editBlogFormReducer'
import loginFormReducer from './reducers/loginFormReducer'
import createAccountFormReducer from './reducers/createAccountFormReducer'
import headerReducer from './reducers/headerReducer'
import usersReducer from './reducers/usersReducer'
import loadingContentReducer from './reducers/loadingContentReducer'
import commentFormReducer from './reducers/commentFormReducer'
import notificationReducer from './reducers/notificationReducer'
import userAvatarFormReducer from './reducers/userAvatarFormReducer'

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    user: userReducer,
    createBlogForm: createBlogFormReducer,
    editBlogForm: editBlogFormReducer,
    loginForm: loginFormReducer,
    createAccountForm: createAccountFormReducer,
    header: headerReducer,
    users: usersReducer,
    contentLoading: loadingContentReducer,
    commentForm: commentFormReducer,
    notification: notificationReducer,
    avatarForm: userAvatarFormReducer
  }
})

export default store