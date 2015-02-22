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
var pos_tweets =[];
var neg_tweets =[];
var pos_count = 0;
var neg_count = 0;
var total_count = 0;
var pos_per = 0;  
function initialize() {
  var mapOptions = {
    zoom: 10,
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
      pos_tweets=new Array();
      neg_tweets=new Array();

// 読み込み
//      console.log("/tweets_"+sw.lat()+"_"+ne.lat()+"_"+sw.lng()+"_"+ne.lng()+"_"+document.form1.from.value+"_"+document.form1.to.value+".json")
      var aaa=$.getJSON("/tweets_"+sw.lat()+"_"+ne.lat()+"_"+sw.lng()+"_"+ne.lng()+".json", function(data) {
        for(var i=0; i<data.length; i++){
          tweets.push({
            location: new google.maps.LatLng(data[i].lat, data[i].lng),
            //weight は pos nega判定した値を入れる?
            weight: data[i].np,
          });
          if (data[i].np >= 0){
            pos_tweets.push({
              location: new google.maps.LatLng(data[i].lat, data[i].lng),
              //weight は pos nega判定した値を入れる?
              weight: data[i].np,            
            })
          }
          else{
            neg_tweets.push({
              location: new google.maps.LatLng(data[i].lat, data[i].lng),
              weight:(-1)*data[i].np,
            })
            pos_count = pos_tweets.length;
            neg_count = neg_tweets.length;
            total_count = pos_count+neg_count;
            pos_per = 1.0* pos_count / total_count;
          }


jQuery( function() {
    jQuery . jqplot(
        'jqPlot-sample',
        [
            [
                [ 'Positive', pos_count ],
                [ 'Negative', neg_count ]
            ]
        ],
        {
            seriesDefaults: {
                renderer: jQuery . jqplot . PieRenderer,
                rendererOptions: {
                    padding: 5,
                    showDataLabels: true
                }
            },
        }
    );
} );
        }
      });
      console.log(typeof aaa);
      if (typeof tweets !== "undefined"){
        console.log("flag");
        console.log(tweets);
        setTimeout('set_heat()',3000);;
      }
      var aaa=$.getJSON("/pos_sampled_tweets_"+sw.lat()+"_"+ne.lat()+"_"+sw.lng()+"_"+ne.lng()+".json", function(sampled_tweets) {
      for (var i = 0; i < sampled_tweets.length; i++) {
        document.getElementById(""+(i+1)+"_np").innerHTML = sampled_tweets[i].np;
        document.getElementById(""+(i+1)+"_t").innerHTML = new Date(sampled_tweets[i].time*1000).toLocaleString();
        document.getElementById(""+(i+1)+"_u").innerHTML = sampled_tweets[i].name;
        document.getElementById(""+(i+1)+"_c").innerHTML = sampled_tweets[i].containts;        
      };
      });
      var aaa=$.getJSON("/neg_sampled_tweets_"+sw.lat()+"_"+ne.lat()+"_"+sw.lng()+"_"+ne.lng()+".json", function(sampled_tweets) {
      for (var i = 0; i < sampled_tweets.length; i++) {
        document.getElementById(""+(i+4)+"_np").innerHTML = sampled_tweets[i].np;
        document.getElementById(""+(i+4)+"_t").innerHTML = new Date(sampled_tweets[i].time*1000).toLocaleString();
        document.getElementById(""+(i+4)+"_u").innerHTML = sampled_tweets[i].name;
        document.getElementById(""+(i+4)+"_c").innerHTML = sampled_tweets[i].containts;        
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
  p_heatmap.setData([]);
  p_heatmap.setData(pos_tweets);
  p_heatmap.setMap(map);
}
/* 
function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}
*/ 

function positive() {
  n_heatmap.setMap(null);
  p_heatmap.setData([]);
  p_heatmap.setData(pos_tweets);
  p_heatmap.setMap(map);
}

function negative(){
  p_heatmap.setMap(null);
  n_heatmap.set('gradient',  null);
  n_heatmap.setData([]);
  n_heatmap.setData(neg_tweets);
  n_heatmap.setMap(map);  
}

function neg_pos(){
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
  n_heatmap.set('gradient',  gradient);
  p_heatmap.setMap(null);
  n_heatmap.setMap(null);
  n_heatmap.setData([]);
  n_heatmap.setData(neg_tweets);
  n_heatmap.setMap(map);  
  p_heatmap.setData([]);
  p_heatmap.setData(pos_tweets);
  p_heatmap.setMap(map);  
}
function pos_neg(){
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
  n_heatmap.set('gradient',  gradient);
  p_heatmap.setMap(null);
  n_heatmap.setMap(null);
  n_heatmap.setData([]);
  n_heatmap.setData(neg_tweets);
  p_heatmap.setData([]);
  p_heatmap.setData(pos_tweets);
  p_heatmap.setMap(map);  
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