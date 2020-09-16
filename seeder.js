const moogoose = require('mongoose')
const User = require('./models/User')
const Post = require('./models/Post')
const axios = require('axios')
const faker = require('faker')
const categories = ['Art', 'Education', 'Travel', 'Photography', 'Technology']
require('dotenv').config({ path: 'variables.env' })

moogoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('Db connect')
    await addNewPosts()
  })
  .catch((err) => {
    console.log(err)
  })

async function addNewPosts() {
  try {
    const user = await User.findOne({ username: 'DannyWang' })
    for (let i = 0; i < 30; i++) {
      const newPost = await Post.create({
        categories: randomCategories(categories),
        title: faker.random.words(2),
        imgUrl: faker.image.abstract(940, 650),
        description: faker.lorem.paragraph(4),
        createdBy: user._id,
      })
    }
  } catch (error) {
    console.log(error)
  }
}

function randomCategories(categories) {
  const randomIndex = Math.floor(Math.random() * categories.length) || 1
  return categories.sort(() => Math.random() - 0.5).slice(0, randomIndex)
}
