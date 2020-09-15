const moogoose = require('mongoose')

const PostSchema = new moogoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  categories: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: moogoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  messages: [
    {
      messageBody: {
        type: String,
        required: true,
      },
      messageDate: {
        type: Date,
        default: Date.now,
      },
      messageUser: {
        type: moogoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    },
  ],
})

// Create index for search function
PostSchema.index({
  // search all field using text
  '$**': 'text',
})

module.exports = moogoose.model('Post', PostSchema)
