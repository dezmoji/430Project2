const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let PostModel = {};

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  text: {
    type: String,
    required: true,
    trim: true,
  },

  tags: {
    type: mongoose.Schema.Types.Array,
    required: false,
    default: [],
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

PostSchema.statics.toAPI = doc => ({
  title: doc.title,
  text: doc.text,
  tags: doc.tags,
  owner: doc.owner,
  createdDate: doc.createdDate,
  _id: doc._id,
});

PostSchema.statics.findMostRecent = callback => PostModel.find().sort({ createdDate: -1 }).exec(callback);

PostSchema.statics.removeByID = (docID, callback) => {
  const search = {
    _id: docID,
  };

  return PostModel.find(search).remove().exec(callback);
};

PostModel = mongoose.model('Post', PostSchema);

module.exports.PostModel = PostModel;
module.exports.PostSchema = PostSchema;
