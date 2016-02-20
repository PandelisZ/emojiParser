var mongoose = require('mongoose');
var emojiDb = require('./app/models/emoji');
//var replaceStream = require('replacestream');
var Localize = require('localize');
var strSplit = require('strsplit');

var myEmoji = new Localize({
    "💍": {
        "emoji": "for"
    },
    "😯": {
        "emoji": "in"
    },
    "\u{1F432}": {
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

  String.prototype.toUnicode = function(){
    var result = "";
    for(var i = 0; i < this.length; i++){
        result += "\\u" + ("000" + this[i].charCodeAt(0).toString(16)).substr(-4);
    }
    return result;
};

  var toSwift = function(parsedid, callback, err){

    var q = {id: parsedid};
    var compiled = '';
    var rawUnicode = '';

    emojiDb.findOne(q, function (err, data) {
      if (err) return handleError(err);

      //compiled = myEmoji.translate("🐉");
      rawUnicode = data.src.toUnicode();
      console.log(rawUnicode);
      var r = /\\u([\d\w]{4})/gi;
      rawUnicode = rawUnicode.replace(r, function (match, grp) {
          return String.fromCharCode(parseInt(grp, 16)); } );
      rawUnicode = unescape(rawUnicode);
      console.log(rawUnicode);


      for(var i = 0; i < data.src.length; i++){

        var character = data.src.charAt(i);
        var translated = ' ';
        if (character != ' '){
          //translated = myEmoji.translate(character);
          //console.log(character);
        }
        compiled = compiled + translated;
      }


      //callback(err, compiled)

    });

    // var newEmoji = new emojiDb();
    // newEmoji.id = 666;
    // newEmoji.name = 'TestOut';
    // newEmoji.swift = compiled;
    //
    // newEmoji.save(function(err){
    //   if (err){
    //     return('Oh f*$k');
    //   }
    // });
  }
  module.exports.toSwift = toSwift;


})();
