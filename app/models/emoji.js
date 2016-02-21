// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var emojiSchema = new Schema({
  name: String,
  src: String,
  swift: String,
  stdout: String,
  error: String,
  compiled: Boolean
});

emojiSchema.methods.findNext = function() {
  // add some stuff to the users name
     var ret = db.counters.findAndModify(
            {
              query: { _id: "userid" },
              update: { $inc: { seq: 1 } },
              new: true
            }
     );

     return ret.seq;
};


var Emoji = mongoose.model('Emoji', emojiSchema);

// make this available to our users in our Node applications
module.exports = Emoji;
