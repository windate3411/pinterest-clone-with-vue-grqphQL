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
    const response = await axios.get(
      `https://picsum.photos/v2/list?page=4&limit=10`
    )
    const imageList = await response.data
    for (let i = 0; i < imageList.length; i++) {
      const newPost = await Post.create({
        categories: randomCategories(categories),
        title: faker.random.words(2),
        imgUrl: response.data[i].download_url,
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
