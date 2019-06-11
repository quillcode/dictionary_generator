const mongoose = require('mongoose');
// the body of a post is quilljs's Delta object stored as string
// hero_object is the path to img
// or url
const PostSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    brief: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    hero_image: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// posts is the collection name where words will be saved
module.exports = mongoose.model('Post', PostSchema, 'posts');