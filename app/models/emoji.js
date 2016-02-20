// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var emojiSchema = new Schema({
  id: Number,
  name: String,
  src: String,
  swift: String
});


var Emoji = mongoose.model('Emoji', emojiSchema);

// make this available to our users in our Node applications
module.exports = Emoji;
