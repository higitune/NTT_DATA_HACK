
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

// from DB catch tweets
app.param('prms',function(req,res,next,id){
	next();
});
var sqlite3 = require('sqlite3').verbose();

app.get('/tweets_:prms.json', function(req, res) {
  var db = new sqlite3.Database('1226.db');
  var selected_tweets;
  var splited_params=req.params.prms.split('_')
  console.log(splited_params);
  db.serialize(function(){
//	db.all("SELECT id,lat,lng FROM tweets limit 10", function(err, rows){  	
     db.all("SELECT lat,lng,np FROM tweets where '"+splited_params[0]+"' <= lat and lat <= '" + splited_params[1] +"' and '"+splited_params[2]+"' <= lng and lng <= '"+splited_params[3]+"'", function(err, rows){
	    res.type('json');
	    console.log(err);
		selected_tweets=rows;
		var tweetJSON =JSON.stringify(selected_tweets)
		res.send(tweetJSON);
	}); 
  });
});

app.get('/sampled_tweets_:prms.json', function(req, res) {
  var db = new sqlite3.Database('1226.db');
  var selected_tweets;
  var splited_params=req.params.prms.split('_')
  console.log(splited_params);
  db.serialize(function(){
//	db.all("SELECT id,lat,lng FROM tweets limit 10", function(err, rows){  	
     db.all("SELECT name,time,containts,lat,lng FROM tweets where '"+splited_params[0]+"' <= lat and lat <= '" + splited_params[1] +"' and '"+splited_params[2]+"' <= lng and lng <= '"+splited_params[3]+"' limit 5", function(err, rows){
	    res.type('json');
	    console.log(err);
		selected_tweets=rows;
		var tweetJSON =JSON.stringify(selected_tweets)
		res.send(tweetJSON);
	}); 
  });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

