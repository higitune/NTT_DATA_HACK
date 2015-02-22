var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('tweets.sqlite3');
var selected_tweets;
exports.index = function(req, res){
  db.serialize(function(){
  var message = "";
    // 検索
    if (req.body.submitBtn == "search") {
      message = "検索結果を表示しました。";
      message=""+req.body.ne_y+"";
      db.all("SELECT name,time,containts FROM tweets where lat <= '" + req.body.ne_x + "' and '" + req.body.sw_x + "' <= lat and '" + req.body.sw_y + "' <= lng and lng <= '" + req.body.ne_y +"' limit 5", function(err, rows){
        if (!err) {
        　if(rows.length == 0) {
        　  message = "見つかりませんでした。";
        　}
          message=""+rows
          res.render('index', {
            messages: message,
            tweets: rows
          }); 
        }
        else {
          console.log(err);
        }   
      }); 
    }
    // 全レコードを取得
    else {
      db.all("SELECT name,time,containts FROM tweets limit 5", function(err, rows){
        if (!err) {
          res.render('index', {
            messages: message,
            tweets: rows
          }); 
          selected_tweets=rows
        }
        else {
          console.log(err);
        }   
      });
    } 
  });
};
exports.hoge="fuga"
exports.tweets=selected_tweets;