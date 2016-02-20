var mongoose = require('mongoose');
var emojiDb = require('./app/models/emoji');
//var replaceStream = require('replacestream');
var Localize = require('localize');
var strSplit = require('strsplit');
var fs = require('fs');
var exec = require('child_process').exec;


var myEmoji = new Localize({
    "💍": {
        "emoji": "for"
    },
    "😯": {
        "emoji": "in"
    },
    "\u1F432": {
        "emoji": "0"
    },
    "😀": {
        "emoji": "."
    },
    "😀": {
        "emoji": "."
    },
    "😞": {
        "emoji": "<"
    },
    "🐍": {
        "emoji": "1"
    },
    "🐉": {
        "emoji": "0"
    },
    "🖨": {
        "emoji": "print"
    },
    "☀️": {
        "emoji": "("
    },
    "❄️": {
        "emoji": ")"
    },
    "🙈": {
        "emoji": "}"
    },
    "🙉": {
        "emoji": "{"
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

    var q = {id: parsedid};
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
            data.update({ swift: compiled, stdout: stdout }).exec();
            if (error !== null) {
                console.log('exec error: ' + error);
            }

         });

      console.log('var' + stdOutput);

      emojiDb.findOne(q, function (err, data) {
        callback(err, data);
      });
    });
  }
  module.exports.toSwift = toSwift;


})();
