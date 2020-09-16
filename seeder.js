const moogoose = require('mongoose')
const User = require('./models/User')
const Post = require('./models/Post')
require('dotenv').config({ path: 'variables.env' })
console.log('uri', process.env.MONGO_URI)
moogoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('Db connect')
    await addNewPost()
  })
  .catch((err) => {
    console.log(err)
  })

async function addNewPost() {
  const user = await User.findOne({ username: 'DannyWang' })
  const newPost = await Post.create({
    categories: ['Food'],
    title: 'A tasty dinner',
    imgUrl:
      'https://images.pexels.com/photos/691114/pexels-photo-691114.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    description: 'Picture of recipe I would like to prepare',
    createdBy: user._id,
  })
}
