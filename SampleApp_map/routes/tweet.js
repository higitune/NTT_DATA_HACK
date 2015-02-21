
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.type('json');
  var tweetJSON =JSON.stringify(require.main.exports.selected_tweets)
  res.send(tweetJSON);
};