const { ApolloServer, AuthenticationError } = require('apollo-server')
const moogoose = require('mongoose')

const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'typeDefs.gql')
const typeDefs = fs.readFileSync(filePath, 'utf-8')
const resolvers = require('./resolvers')
const jwt = require('jsonwebtoken')

require('dotenv').config({ path: 'variables.env' })

const User = require('./models/User')
const Post = require('./models/Post')

moogoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Db connect'))

// verify user using jwt

const getUser = async (token) => {
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET)
    } catch (error) {
      console.log(error)
      throw new AuthenticationError(
        'The access token has been expired! Please login again!'
      )
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => ({
    name: error.name,
    message: error.message.replace('Context creation failed.:', ''),
  }),
  context: async ({ req }) => {
    const token = req.headers['authorization']
    return { User, Post, currentUser: await getUser(token) }
  },
})

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`server is running on ${url}`)
})
