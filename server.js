const { ApolloServer, gql } = require('apollo-server')
const moogoose = require('mongoose')

require('dotenv').config({ path: 'variables.env' })
const User = require('./models/User')
const Post = require('./models/Post')

moogoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Db connect'))

const typeDefs = gql`
  type Todo {
    task: String
    completed: Boolean
  }
  type Query {
    getTodos: [Todo]
  }
  type Mutation {
    addTodo(task: String, completed: Boolean): Todo
  }
`

const server = new ApolloServer({
  typeDefs,
  context: {
    User,
    Post,
  },
})

server.listen().then(({ url }) => {
  console.log(`server is running on ${url}`)
})
