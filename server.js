const { ApolloServer } = require('apollo-server')
const moogoose = require('mongoose')

const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'typeDefs.gql')
const typeDefs = fs.readFileSync(filePath, 'utf-8')
const resolvers = require('./resolvers')

require('dotenv').config({ path: 'variables.env' })

const User = require('./models/User')
const Post = require('./models/Post')

moogoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Db connect'))

const server = new ApolloServer({
  typeDefs,
  context: {
    User,
    Post,
  },
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`server is running on ${url}`)
})
