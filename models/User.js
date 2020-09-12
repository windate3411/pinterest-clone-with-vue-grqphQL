const moogoose = require('mongoose')
const md5 = require('md5')
const bcrypt = require('bcrypt')

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

// create user default avatar before saving
UserSchema.pre('save', function (next) {
  this.avatar = `https://gravatar.com/avatar/${md5(this.username)}?d=identicon`
  next()
})

// hash password
UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err)
      this.password = hash
      next()
    })
  })
})

module.exports = moogoose.model('User', UserSchema)
