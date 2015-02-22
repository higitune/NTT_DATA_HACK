/*
function get_tweets_from_json(sw,ne){
  var ret=[];
  d3.json("/tweets_"+sw.lat()+"_"+ne.lat()+"_"+sw.lng()+"_"+ne.lng()+".json", function(error, src){
    var data=src;   
    for(var i=0; i<data.length; i++){
      console.log(data[i].lat);
      console.log(data[i].np);
      ret.push({
        location: new google.maps.LatLng(data[i].lat, data[i].lng),
        //weight は pos nega判定した値を入れる?
        weight: float(data[i].np),
      });
    };
    console.log(ret[0]);
    return ret[0].weight;
  });
};
*/

// Adding 500 Data Points
var map, pointarray, heatmap, p_heatmap, n_heatmap;
heatmap = new google.maps.visualization.HeatmapLayer({});
p_heatmap = new google.maps.visualization.HeatmapLayer({});
n_heatmap = new google.maps.visualization.HeatmapLayer({});
heatmap.set('radius', 40);
p_heatmap.set('radius', 40);
n_heatmap.set('radius', 40);
var tweetrawData = [];
var tweet;
var bounds;
var markers = [];
var tweets = [];
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
      tweets=new Array();

      var aaa=$.getJSON("/tweets_"+sw.lat()+"_"+ne.lat()+"_"+sw.lng()+"_"+ne.lng()+".json", function(data) {
        for(var i=0; i<data.length; i++){
          tweets.push({
            location: new google.maps.LatLng(data[i].lat, data[i].lng),
            //weight は pos nega判定した値を入れる?
            weight: data[i].np,
          });
        }
      });
      console.log(typeof aaa);
      if (typeof tweets !== "undefined"){
        console.log("flag");
        console.log(tweets);
        setTimeout('set_heat()',3000);;
      }
      var aaa=$.getJSON("/sampled_tweets_"+sw.lat()+"_"+ne.lat()+"_"+sw.lng()+"_"+ne.lng()+".json", function(sampled_tweets) {
      for (var i = 0; i < sampled_tweets.length; i++) {
        document.getElementById(""+(i+1)+"_t").innerHTML = new Date(sampled_tweets[i].time*1000).toLocaleString();
        document.getElementById(""+(i+1)+"_u").innerHTML = sampled_tweets[i].name;
        document.getElementById(""+(i+1)+"_c").innerHTML = sampled_tweets[i].containts;        
      };
      });
  });
}

function addMarker(position) {
  markers.push(new google.maps.Marker({
    position: position,
    map: map,
    animation: google.maps.Animation.DROP
  }));
}
function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

function set_heat(){
  heatmap.setData([]);
  heatmap.setData(tweets);
  heatmap.setMap(map);
}
 
function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}
 
function toggle_type() {
  pos_tweets=[]
  console.log(tweets)
  tweets.forEach(function(tweet){
    if (tweet.weight>=0){
      console.log("hoge");
      pos_tweets.push(tweet)
    }
  });
  heatmap.setMap(null);
  n_heatmap.setMap(null);
  p_heatmap.setData([]);
  p_heatmap.setData(pos_tweets);
  p_heatmap.setMap(map);
}

function negative(){
  neg_tweets=[]
  tweets.forEach(function(tweet){
    if (tweet.weight<0){
      neg_tweets.push({
        location:tweet.location,
        weight:(-1)*tweet.weight
      })
    }
  });
  heatmap.setMap(null);
  p_heatmap.setMap(null);
  n_heatmap.setData([]);
  n_heatmap.setData(neg_tweets);
  n_heatmap.setMap(map);  
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
  heatmap.set('radius', heatmap.get('radius') ? 40 : 20);
}

function changeOpacity() {
  heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

google.maps.event.addDomListener(window, 'load', initialize);