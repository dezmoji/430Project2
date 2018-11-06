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
    owner: doc.owner
});

PostModel = mongoose.model('Post', PostSchema);

module.exports.PostModel = PostModel;
module.exports.PostSchema = PostSchema;
