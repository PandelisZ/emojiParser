var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://emoji:emoji@ds041821.mongolab.com:41821/emoji');
var emojiDb = require('./app/models/emoji');
var compile = require('./compile')

var port = process.env.PORT || 8000;
var router = express.Router();

// compile.toSwift(1, function(err, compiled){
//   console.log(compiled);
// });

compile.toSwift(1);


router.use(function(req, res, next){
  console.log('Something is happening');
  next();
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/api/post', function(req, res){
  var newEmoji = new emojiDb();
  newEmoji.id = req.body.id;
  newEmoji.name = req.body.name;
  newEmoji.src = req.body.src;
  newEmoji.swift = req.body.swift;

  newEmoji.save(function(err){
    if (err){
      res.send('Oh f*$k');
    }
    res.json({message: '👍'});
    console.log(newEmoji.id);
    console.log(newEmoji.name);
    console.log(newEmoji.src);
    console.log(newEmoji.swift);
  });

});

app.get('/api/list', function(req, res){
  emojiDb.find(function(err, out){
    res.json(out);
  });

});

app.use('/', router);
app.listen(port, function(){
  console.log('\u{1f604}' + ' :' + port);
});
