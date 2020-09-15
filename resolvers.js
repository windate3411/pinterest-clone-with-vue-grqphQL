const User = require('./models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { findOneAndUpdate } = require('./models/User')

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user
  return jwt.sign({ username, email }, secret, {
    expiresIn,
  })
}

module.exports = {
  Query: {
    getPosts: async (_, args, { Post }) => {
      const posts = await Post.find({}).sort({ createdDate: 'desc' }).populate({
        path: 'createdBy',
        model: 'User',
      })
      return posts
    },
    getPost: async (_, { post_id }, { Post }) => {
      const post = await Post.findOne({ _id: post_id }).populate({
        path: 'messages.messageUser',
        model: 'User',
      })
      return post
    },
    getCurrentUser: async (_, args, { User, currentUser }) => {
      if (!currentUser) return null
      const user = await User.findOne({
        username: currentUser.username,
      }).populate({
        path: 'favorites',
        model: 'Post',
      })
      return user
    },
    infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }) => {
      let posts
      if (pageNum === 1) {
        posts = await Post.find({})
          .sort({ createdDate: 'desc' })
          .populate({
            path: 'createdBy',
            model: 'User',
          })
          .limit(pageSize)
      } else {
        const skips = pageSize * (pageNum - 1)
        posts = await Post.find({})
          .sort({ createdDate: 'desc' })
          .populate({
            path: 'createdBy',
            model: 'User',
          })
          .skip(skips)
          .limit(pageSize)
      }

      const totalPosts = await Post.countDocuments()
      const hasMorePosts = totalPosts > pageNum * pageSize
      return { posts, hasMorePosts }
    },
  },
  Mutation: {
    signinUser: async (_, { username, password }, { User }) => {
      const user = await User.findOne({ username })
      if (!user) throw new Error('User not found')
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) throw new Error('Invalid Password')
      return { token: createToken(user, process.env.SECRET, '1hr') }
    },
    signupUser: async (_, { username, email, password }, { User }) => {
      const user = await User.findOne({ username })
      if (user) throw new Error('Username already exists')
      const newUser = await new User({
        username,
        email,
        password,
      }).save()
      return { token: createToken(newUser, process.env.SECRET, '1hr') }
    },
    addPost: async (
      _,
      { title, description, categories, imgUrl, creatorId },
      { Post }
    ) => {
      const newPost = await new Post({
        title,
        description,
        categories,
        imgUrl,
        createdBy: creatorId,
      }).save()
      return newPost
    },
    addPostMessage: async (_, { messageBody, user_id, post_id }, { Post }) => {
      const newMessage = {
        messageBody,
        messageUser: user_id,
      }
      const post = await Post.findOneAndUpdate(
        // find the certain post
        { _id: post_id },
        // add the new newMessage to the existing array to specific positon
        {
          $push: {
            messages: { $each: [newMessage], $position: 0 },
          },
        },
        // return the updated document
        { new: true }
      ).populate({
        path: 'messages.messageUser',
        model: 'User',
      })
      return post.messages[0]
    },
    likePost: async (_, { post_id, username }, { Post, User }) => {
      const post = Post.findOneAndUpdate(
        { _id: post_id },
        { $inc: { likes: 1 } },
        { new: true }
      )
      const user = User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: post_id } },
        { new: true }
      ).populate({
        path: 'favorites',
        model: 'Post',
      })
      return {
        likes: post.likes,
        favorites: user.favorites,
      }
    },
    unLikePost: async (_, { post_id, username }, { Post, User }) => {
      const post = Post.findOneAndUpdate(
        { _id: post_id },
        { $inc: { likes: -1 } },
        { new: true }
      )
      const user = User.findOneAndUpdate(
        { username },
        { $pull: { favorites: post_id } },
        { new: true }
      ).populate({
        path: 'favorites',
        model: 'Post',
      })
      return {
        likes: post.likes,
        favorites: user.favorites,
      }
    },
  },
}
