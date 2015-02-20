var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.sqlite3');

exports.index = function(req, res){
  db.serialize(function(){
    var message = "";
    
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
      db.all("SELECT id, name, furigana FROM users WHERE name like '" + req.body. searchText + "'", function(err, rows){
        if (!err) {
        　if(rows.length == 0) {
        　  message = "見つかりませんでした。";
        　}
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
      db.all("SELECT id, name, furigana FROM users", function(err, rows){
        if (!err) {
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
  }); 
};
