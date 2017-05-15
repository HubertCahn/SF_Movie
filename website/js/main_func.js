
/* This JS file includes the main funcitons of the index.html, like map(ceating google map, drawing marker 
  and heatmap layer), xml(http transport, parse) and snackbar(fade in and out). */

var map; // Google map item
var infoWindow; // Object on the map to show content
var heatmap; // Layer on the map to show the distribution of points
var pointsArr = new Array(); // Array to store google map LatLng object
var markersArr = new Array(); // Array to store google map marker object
var infoArr = new Array(); // Array to store DOM element contains marker's infomation
var tag = true; // This tag shows whether ther user enter some content to the input box
// Path to the PHP scripts that generate XML
var URL_MARKER_PHP = "http://ec2-54-169-212-184.ap-southeast-1.compute.amazonaws.com//website/php/expMarkerXML.php"; 
var URL_HEATMAP_PHP = "http://ec2-54-169-212-184.ap-southeast-1.compute.amazonaws.com//website/php/expHeatmapXML.php";

/* initMap() function creates a map on the page with some default attributes, info window and heatmap layer on the map */
function initMap() {
  var center = {lat: 37.755745, lng: -122.441113}; // Geography location of the center of San Francisco
  // Get the map DIV on the page
  map = new google.maps.Map(document.getElementById('map'), { 
    center: center, // Map center
    zoom: 12, // city(10), streets(15)
    mapTypeId: 'hybrid',
    tilt: 45
  });

  infoWindow = new google.maps.InfoWindow;

  heatmap = new google.maps.visualization.HeatmapLayer({ 
    map: map
  });
}

/* addMarkers() function clears the old markers and adds some new markers on the map. 
If the XML from server is empty, then popup a snack bar */
function addMarkers(){
  clearMarkers();
  clearHeatmap();
  parseMarkerXML();
  if(tag){
    if(pointsArr.length>0){
      drop();
    }else{
      showSnackbar();
    }
  }
}

/* addHeatmapLayer() function clears the old heatmap layer and draw the new layer */
function addHeatmapLayer(){
  clearMarkers();
  clearHeatmap();
  parseHeatmapXML();
  drawHeatmap();
}

/* parseMarkerXML() function will send the movie title from user input to the server, 
  then the server will return the corresponding info(movie title, filming location and geography location) in XML,
   which will be parsed latter. */
function parseMarkerXML() {
  var film = document.getElementById("autocomplete").value; // Get the user's input from the page
  // Check whether the input is empty. If not, send http request to the server
  if(!film){
    tag = false;
  }else{
    tag = true;
    // Send http request to the server and get XML back. Then, parse the XML and push the data into the reserved array
  downloadUrl(URL_MARKER_PHP, function(data) {
    var xml = data.responseXML;
    var markers = xml.documentElement.getElementsByTagName('marker');
    Array.prototype.forEach.call(markers, function(markerElem) {
      var title = markerElem.getAttribute('title'); 
      var locations = markerElem.getAttribute('locations');
      var point = new google.maps.LatLng(
        parseFloat(markerElem.getAttribute('latitude')),
        parseFloat(markerElem.getAttribute('longitude')));
      pointsArr.push(point);
      var infowincontent = document.createElement('div');
      var strong = document.createElement('strong');
      strong.textContent = title
      infowincontent.appendChild(strong);
      infowincontent.appendChild(document.createElement('br'));
      var text = document.createElement('text');
      text.textContent = locations
      infowincontent.appendChild(text);
      infoArr.push(infowincontent);
    });
  }, film, 'MARKER');
  }
};

/* parseHeatmapXML() has similar function with parseMarkerXML() */
function parseHeatmapXML() {

  var proCompany = document.getElementById("proCompany").value;
  var year = document.getElementById("year").value;
          //Change this depending on the name of your PHP or XML file
          downloadUrl(URL_HEATMAP_PHP, function(data) {
            var xml = data.responseXML;
            var heats = xml.documentElement.getElementsByTagName('heat');
            Array.prototype.forEach.call(heats, function(markerElem) {
              var point = new google.maps.LatLng(
                parseFloat(markerElem.getAttribute('latitude')),
                parseFloat(markerElem.getAttribute('longitude')));
              pointsArr.push(point);
            });
          }, new Array(proCompany, year), 'HEATMAP');
        };

/* addMarkerWithTimeout() function will transform the LatLng object into marker and set it on the map, 
  then add listener on each marker so that it will popup an info window when clicked */
function addMarkerWithTimeout(position, info, timeout) {
  window.setTimeout(function() {
    var marker = new google.maps.Marker({
      position: position,
      map: map,
      animation: google.maps.Animation.DROP
    });
    marker.addListener('click', function() {
      infoWindow.setContent(info);
      infoWindow.open(map, marker);
    });
    markersArr.push(marker); // All the marker will be stored in the reserved array */
  }, timeout);
};

/* drop() function put each LatLng object to addMarkerWithTimeout() one by one */
function drop() {
  for (var i = 0; i < pointsArr.length; i++) {
    addMarkerWithTimeout(pointsArr[i], infoArr[i], i * 200);
  }
}

/* clearMarkers() function set every marker to empty map, in other words it move all the marker out from the page map */
function clearMarkers(){
  for (var i = 0; i < markersArr.length; i++) {
    markersArr[i].setMap(null);
  }
  /* empty all the storage array */
  pointsArr = [];
  markersArr = [];
  infoArr = []
}

/* drawHeatmap() function set all the data points to be displayed by the heatmap */
function drawHeatmap(){
  heatmap.setData(pointsArr);
  heatmap.set('radius', 40);
}

/* clearHeatmap() function set empty data to be displayed, thus it will clear the previous heatmap */
function clearHeatmap(){
  heatmap.setData([]);
  pointsArr = [];
}

/* downloadUrl() function load the XML file using browser-provied XMLHttpRequest Object. The url
  specific the path to PHP scripts that generates the XML and callback indicates the function
  that the scripts calls when the XML returns */
function downloadUrl(url, callback, arg, TAG) {
  var request = window.ActiveXObject ?
  new ActiveXObject('Microsoft.XMLHTTP') :
  new XMLHttpRequest;

  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
      callback(request, request.status);
    }
  };
  //false means Synchronous. Typically, we should make it asynchronous, but we put some code 
  //after downloadUrl(), therefore we need to wait until all the XML file downloaded. 
  request.open('POST', url, false);
  request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  if(TAG == 'MARKER'){
    request.send("film="+arg);
  }  else if(TAG == 'HEATMAP'){
    request.send("proCompany="+arg[0]+"&year="+arg[1]);
  }

}

function showSnackbar(){
  // Get the snackbar DIV
  var mySnackbar = document.getElementById("snackbar")
    // Add the "show" class to DIV then the page will popup a snackbar
    mySnackbar.className = "show";
    // After 2.9 seconds, remove the show class from DIV
    setTimeout(function(){ mySnackbar.className = mySnackbar.className.replace("show", ""); }, 2900);
  }

function doNothing() {}