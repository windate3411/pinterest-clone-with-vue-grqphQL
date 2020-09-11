module.exports = {
  Mutation: {
    signupUser: async (_, { username, email, password }, { User }) => {
      const user = await User.findOne({ username })
      if (user) throw new Error('Username already exists')
      const newUser = await new User({
        username,
        email,
        password,
      }).save()
      return newUser
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
  },
}
