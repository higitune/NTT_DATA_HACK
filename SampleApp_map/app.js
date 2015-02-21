
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , index = require('./routes/index')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
// add start
app.post('/', routes.index);
// add end
var sqlite3 = require('sqlite3').verbose();
app.get('/tweets.json', function(req, res) {
  var db = new sqlite3.Database('tweets.sqlite3');
  var selected_tweets;
  db.serialize(function(){
	db.all("SELECT id,lat,lng FROM tweets limit 5", function(err, rows){
	    res.type('json');
	    console.log(rows);
		selected_tweets=rows;
		var tweetJSON =JSON.stringify(selected_tweets)
		res.send(tweetJSON);
	}); 
  });
  // We want to set the content-type header so that the browser understands
  //  the content of the response.
//  res.type('json');
  // Normally, the would probably come from a database, but we can cheat:
//  var tweetJSON =JSON.stringify(selected_tweets)
  // Since the request is for a JSON representation of the people, we
  //  should JSON serialize them. The built-in JSON.stringify() function
  //  does that.
//  var peopleJSON = JSON.stringify(people);
  console.log("hogehoge");
  console.log(selected_tweets);
  // Now, we can use the response object's send method to push that string
  //  of people JSON back to the browser in response to this request:
//  res.send(tweetJSON);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

