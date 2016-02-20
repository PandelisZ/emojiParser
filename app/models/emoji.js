// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var emojiSchema = new Schema({
  id: Number,
  name: String,
  src: String,
  swift: String,
  stdout: String
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
