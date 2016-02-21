var mongoose = require('mongoose');
var emojiDb = require('./app/models/emoji');
//var replaceStream = require('replacestream');
var Localize = require('localize');
var strSplit = require('strsplit');
var fs = require('fs');
var exec = require('child_process').exec;

var myEmoji = new Localize({
    "☀️": {
      // sun '('
      "emoji": "("
    },
    "❄️": {
      // snowflake
      "emoji": ")"
    },
    "\u{1F649}": {
      // open monkey
      "emoji": "{"
    },
    "\u{1F648}": {
      // close monkey
      "emoji": "}"
    },
    "\u{1F60A}": {
      // happy face
      "emoji": "["
    },
    "\u{1F643}": {
      // upside down face
      "emoji": "]"
    },
    "\u{1F603}": {
      // wide mouth happy face
      "emoji": "."
    },
    "\u{1F60F}": {
      // side smile face
      "emoji": ","
    },
    "\u{1F617}": {
      // kiss face open eyes
      "emoji": ":"
    },
    "\u{1F61A}": {
      // kiss face close eyes
      "emoji": ";"
    },
    "\u{1F611}": {
      // line mouth face
      "emoji": "="
    },
    "\u{2764}": {
      // red heart
      "emoji": "+"
    },
    "\u{1F499}": {
      // blue heart
      "emoji": "-"
    },
    "\u{1F49B}": {
      // yellow heart
      "emoji": "*"
    },
    "\u{1F49B}": {
      // green heart
      "emoji": "/"
    },
    "\u{1F49C}": {
      // purple heart
      "emoji": "%"
    },
    "\u{1F914}": {
      // pensive face
      "emoji": "?"
    },
    "\u{1F631}": {
      // shocked face
      "emoji": "!"
    },
    "\u{1F625}": {
      // single tear face
      "emoji": "'"
    },
    "\u{1F62D}": {
      // double tear
      "emoji": '"'
    },
    "\u{1F43C}": {
      // panda
      "emoji": "->"
    },
    "\u{1F910}": {
      // zip face
      "emoji": "//"
    },
    "\u{1F911}": {
      // money mouth
      "emoji": "$"
    },
    "\u{1F614}": {
      // sad face
      "emoji": "<"
    },
    "\u{1F606}": {
      // happy face
      "emoji": ">"
    },
    "\u{1F34F}": {
      // green apple
      "emoji": "&&"
    },
    "\u{1F34E}": {
      // red apple
      "emoji": "||"
    },
    "\u{1F432}": {
      // dragon
      "emoji": "0"
    },
    "\u{1F40D}": {
      // snake
      "emoji": "1"
    },
    "\u{1F410}": {
      // goat
      "emoji": "2"
    },
    "\u{1F40E}": {
      // horse
      "emoji": "3"
    },
    "\u{1F412}": {
      // monkey
      "emoji": "4"
    },
    "\u{1F413}": {
      // rooster
      "emoji": "5"
    },
    "\u{1F415}": {
      // dog
      "emoji": "6"
    },
    "\u{1F416}": {
      // pig
      "emoji": "7"
    },
    "\u{1F400}": {
      // rat
      "emoji": "8"
    },
    "\u{1F402}": {
      // ox
      "emoji": "9"
    },
    "\u{1F34A}": {
      // tangerine
      "emoji": "int"
    },
    "\u{1F336}": {
      // hot pepper
      "emoji": "boolean"
    },
    "\u{1F35D}": {
      // spaghetti
      "emoji": "string"
    },
    "\u{1F352}": {
      // cherries
      "emoji": "double"
    },
    "\u{1F368}": {
      // ice cream
      "emoji": "float"
    }
});

myEmoji.setLocale('emoji');

(function(){
  module.exports = {};

  var read = function(parsedid, callback, err){

    var q = {id: parsedid};

    emojiDb.findOne(q, function (err, data) {
      if (err) return handleError(err);
      callback(err, data);
    })


  }
  module.exports.read = read;


//Decode unicode
  String.prototype.toUnicode = function(){
    var result = "";
    for(var i = 0; i < this.length; i++){
        result += "\\u" + ("000" + this[i].charCodeAt(0).toString(16)).substr(-4);
    }
    return result;
};


//recode unicode
function recodeUnicode(str){

  var r = /\\u([\d\w]{4})/gi;
  var recoded = str;
  recoded = recoded.replace(r, function (match, grp) {
      return String.fromCharCode(parseInt(grp, 16)); } );
  recoded = unescape(recoded);

  return recoded

}

  var toSwift = function(parsedid, callback, err){

    var q = {_id: parsedid};
    var compiled = '';
    var rawUnicode = '';
    var stdOutput = '';

    emojiDb.findOne(q, function (err, data) {
      if (err) return handleError(err);

      //compiled = myEmoji.translate("🐉");
      rawUnicode = data.src.toUnicode();
      console.log(rawUnicode);
      console.log(recodeUnicode(rawUnicode));

      console.log(recodeUnicode('\ud83d\udc8d'));

      var unicodeSymbols = [];
      for (var i = 0; i < rawUnicode.length ; i = i+ 6){
        unicodeSymbols.push(rawUnicode.substr(i,6));
      };

      console.log(unicodeSymbols);

      var preTranslated = [];
      var x = 0;
      for (var i = 0; i < unicodeSymbols.length; i++){
        if (unicodeSymbols[x] == '\\u0020'){
          preTranslated.push(' ');
          x ++;
        }else if(unicodeSymbols[x] != null ){
          preTranslated.push(unicodeSymbols[x] + unicodeSymbols[x+1]);
          x = x +2;
        }
      }

      for(var i = 0; i < preTranslated.length; i++){
        if (preTranslated[i] != ' '){
          preTranslated[i] = recodeUnicode(preTranslated[i]);
        }
      }

      console.log(preTranslated);
      var translated = [];
      for(var i = 0; i<preTranslated.length; i++){
        try {
          if (preTranslated[i] == ' '){
            translated.push(' ');
          }else {
            translated.push(myEmoji.translate(preTranslated[i]));
          }
        }
        catch(err) {
            translated.push(preTranslated[i]);
        }

      }

      console.log(translated);

      for(var i = 0; i<translated.length; i++){
        compiled = compiled + translated[i]
      }

      console.log(compiled);

      fs.writeFile("./temp.swift", compiled, function(err) {
          if(err) {
              return console.log(err);
          }

          console.log("The file was saved!");
      });

      var child;

      child = exec("swift temp.swift",
         function (error, stdout, stderr) {
            console.log(stdout);
            if (error == null){
              data.update({ swift: compiled, stdout: stdout, compiled: true }).exec();
            }
            if (error !== null) {
                console.log('exec error: ' + error);
              data.update({ swift: compiled, stdout: stdout, error: error, compiled: false }).exec();
            }
            emojiDb.findOne(q, function (err, data2) {
              callback(err, data2);
            });

         });

    });


  }
  module.exports.toSwift = toSwift;


})();
