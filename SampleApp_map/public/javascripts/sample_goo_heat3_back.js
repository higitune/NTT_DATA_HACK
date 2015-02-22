/*
function get_plot_tweets(tweets,sw, ne, lat_size,lng_size){
  map_lng=(ne.lng()-sw.lng())/lng_size;
  map_lat=(ne.lat()-sw.lat())/lat_size;
  var ret = []
  tweets.forEach(function(tweet){
    // get grid
    new_lat=sw.lat()+Math.floor((tweet.location.lat()-sw.lat())/map_lng)*map_lng;
    new_lng=sw.lng()+Math.floor((tweet.location.lng()-sw.lng())/map_lat)*map_lng;
    ret.push({
        location: new google.maps.LatLng(new_lat, new_lng),
        //weight は pos nega判定した値を入れる?
        weight: 1,
    })
  })
  return ret
}
*/
function get_tweets_from_json(sw,ne){
  ret=[];
  d3.json("/tweets_"+sw.lat()+"_"+ne.lat()+"_"+sw.lng()+"_"+ne.lng()+".json", function(error, data){
    for(var i=0; i<data.length; i++){
      ret.push({
        location: new google.maps.LatLng(data[i].lat, data[i].lng),
        //weight は pos nega判定した値を入れる?
        weight: 1,
      });
    };
  });
  console.log(ret);
  return ret
}

function get_sampled_tweets_from_json(sw,ne){
  ret=[];
  d3.json("/sampled_tweets_"+sw.lat()+"_"+ne.lat()+"_"+sw.lng()+"_"+ne.lng()+".json", function(error, data){
    for(var i=0; i<data.length; i++){
//      console.log(data[i]);
      ret.push({
        user: 1
      });
    };
  });
  console.log(ret);
  return ret
}


// Adding 500 Data Points
var map, pointarray, heatmap;
heatmap = new google.maps.visualization.HeatmapLayer({});
var tweetrawData = [];
var tweet;
var bounds;
/*
d3.csv("/javascripts/tokyo.csv", function (error, src) {
    var data = src;
    for (var i = 0; i < data.length; i++) {
        tweetrawData.push({
        location: new google.maps.LatLng(data[i].latitude, data[i].longitude),
        //weight は pos nega判定した値を入れる?
        weight: 1,
        });
    }
});

// default 処理
d3.json("/tweets.json", function(error, data){
  for(var i=0; i<data.length; i++){
    tweetrawData.push({
      location: new google.maps.LatLng(data[i].lat, data[i].lng),
      //weight は pos nega判定した値を入れる?
      weight: 1,
    });
  };
});
*/
/*
tweets.forEach(function(tweet){
	tweetrawData.push({
		location: new google.maps.LatLng(tweet.lat, tweet.lng),
		//weight は pos nega判定した値を入れる?
		weight: 1,
        });
});
*/
function initialize() {
  var mapOptions = {
    zoom: 13,
    center: new google.maps.LatLng(35.681382, 139.766084),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
// 地図の状態を取得して，適切な粒度で
  google.maps.event.addListener(map, 'idle', function() {
//    window.setTimeout(function() {
      bounds=map.getBounds();
      ne=bounds.getNorthEast();
      sw=bounds.getSouthWest();
      tweets=get_tweets_from_json(sw,ne);
      heatmap.setMap(null);
      heatmap.setData(tweets);
      set_heat();
//      console.log(heatmap.getMap());
      sampled_tweets=get_sampled_tweets_from_json(sw,ne);
//      console.log(sampled_tweets);
      for (var i = 0; i < sampled_tweets.length; i++) {
        document.getElementById(""+(i+1)+"_t").innerHTML = new Date(sampled_tweets[i].time*1000).toLocaleString();
        document.getElementById(""+(i+1)+"_u").innerHTML = sampled_tweets[i].user;
        document.getElementById(""+(i+1)+"_c").innerHTML = sampled_tweets[i].containts;        
      };
  });
}
function set_heat(){
  heatmap.setMap(map);
}
/*
function change_Heatmap(){
  bounds=map.getBounds();
  ne=bounds.getNorthEast();
  sw=bounds.getSouthWest();
  tweet=get_plot_tweets(tweetrawData,sw, ne, 1000,1000);
  for (var i = 0; i < tweet.length; i++) {
    console.log(tweet[i].location.lat(),tweetrawData[i].location.lat())
  }
  heatmap.setData(tweet);
}
*/
function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
  var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ]
  heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
  heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
  heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

google.maps.event.addDomListener(window, 'load', initialize);

