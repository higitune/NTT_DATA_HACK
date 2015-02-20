var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('tweets.sqlite3');

exports.index = function(req, res){
  db.serialize(function(){
    var message = "";
    // 全レコードを取得
      db.all("SELECT id, lat, lng FROM tweets", function(err, rows){
        if (!err) {
          res.render('index', {
            messages: message,
            tweets: rows
          }); 
        }
        else {
          console.log(err);
        }   
      });
  }); 
};
