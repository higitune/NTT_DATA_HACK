var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('tweets.sqlite3');
var selected_tweets;
exports.index = function(req, res){
  db.serialize(function(){
    var message = "";
  var sw_x=29;
  var sw_y=1;
  var ne_x=30;
  var ne_y=100;
    
    // レコードの登録
    if (req.body.submitBtn == "add") {
      db.run("INSERT INTO users (name, furigana) VALUES (?, ?)", req.body.name, req.body.furigana);
      message = "1件登録しました。";
    }
    
    // レコードの削除
    if (req.body.action == "delete") {
      db.run("DELETE FROM users WHERE id = ?", req.body.target);
      message = "1件削除しました。";
    }
    
    // 検索
    if (req.body.submitBtn == "search") {
      message = "検索結果を表示しました。";
      message=""+req.body.ne_y+"";
      db.all("SELECT id,lat,lng FROM tweets where lat <= '" + req.body.ne_x + "' and '" + req.body.sw_x + "' <= lat and '" + req.body.sw_y + "' <= lng and lng <= '" + req.body.ne_y +"' limit 5", function(err, rows){
        if (!err) {
        　if(rows.length == 0) {
        　  message = "見つかりませんでした。";
        　}
          message=""+rows
          res.render('index', {
            messages: message,
            users: rows
          }); 
        }
        else {
          console.log(err);
        }   
      }); 
    }
    // 全レコードを取得
    else {
      db.all("SELECT id,lat,lng FROM tweets limit 10", function(err, rows){
        if (!err) {
          res.render('index', {
            messages: message,
            users: rows
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