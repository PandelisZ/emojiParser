var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://emoji:emoji@ds041821.mongolab.com:41821/emoji');
var emojiDb = require('./app/models/emoji');
var compile = require('./compile')

var port = process.env.PORT || 80;
var router = express.Router();

// compile.toSwift(1, function(err, compiled){
//   console.log(compiled);
// });

//compile.toSwift(1);


router.use(function(req, res, next){
  console.log('Something is happening');
  next();
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', express.static('public'));

app.post('/api/post', function(req, res){
  var newEmoji = new emojiDb();
  newEmoji.name = req.body.name;
  newEmoji.src = req.body.src;
  //newEmoji.swift = req.body.swift;

  var workingId = '';

  newEmoji.save(function(err, data){
    if (err){
      res.send('Oh f*$k');
    }
    compile.toSwift(data.id, function(err, compiledData){
      res.json(compiledData);
    });
  });
});

app.get('/api/:api_id', function(req, res){

  if(req.params.api_id == "all"){
    emojiDb.find(function(err, out){
      res.json(out);
    });
  }
  else if(req.params.api_id == "compiled") {
      emojiDb.find({compiled: true}, function(err, out){
        res.json(out);
      })
  }
  else {
  emojiDb.findById(req.params.api_id, function(err, data) {
                          if (err)
                                  res.send(err);
                          res.json(data);
                  });
  }
});

app.use('/', router);
app.listen(port, function(){
  console.log('Running on' + ' :' + port);
});
