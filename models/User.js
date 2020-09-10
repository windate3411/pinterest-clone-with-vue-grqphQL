const moogoose = require('mongoose')

const UserSchema = new moogoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    type: String,
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  favorites: {
    type: [moogoose.Schema.Types.ObjectId],
    required: true,
    ref: 'Post',
  },
})

module.exports = moogoose.model('User', UserSchema)
