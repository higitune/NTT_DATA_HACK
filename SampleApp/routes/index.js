var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('tweets.sqlite3');

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
	  message=""+req.body.searchText+"";
      db.all("SELECT id,lat,lng FROM tweets where lat <= '" + ne_x + "' and '" + sw_x + "' <= lat and '" + sw_y + "' <= lng and lng <= '" + ne_y +"' limit 10", function(err, rows){
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
      db.all("SELECT id,lat,lng FROM tweets", function(err, rows){
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
