const mongoose = require('mongoose');
const WordSchema = new mongoose.Schema({
  headword: String,
  pronunciation_url:String,
  senses: [{
    label:String,
    meaning: String,
    examples: []
  }],
  meta: {
    last_modified_by: String,
  },
});

// dictionary is the collection name where words will be saved
module.exports = mongoose.model('Word', WordSchema, 'dictionary');