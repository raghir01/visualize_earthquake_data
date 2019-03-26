
function createMap(response) {

  // Define satellite, grayscale and outdoors layers
  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.grayscale",
    accessToken: API_KEY
  });
    var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite": satellite,
    "Grayscale": grayscale,
    "Outdoors": outdoors
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
  };

  // Create our map, giving it the satellite and earthquakes layers to display on load
  var myMap = L.map("map-id", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [satellite]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var features = response.features;
  var colors = ['#A8FFC0','#F7D438','#FFAC4F','#FF7032','#DB4C25','#B51E1E']


    for (var i = 0; i < features.length; i++) {
          var feature = features[i];
          var loc = feature.geometry.coordinates;
          var magnitude = feature.properties.mag;
          var depth = feature.geometry.coordinates[2];
          if (magnitude < 1){
            col = colors[0]
          } else if (magnitude >= 1 && magnitude < 2){
            col = colors[1]
          } else if (magnitude >= 2 && magnitude < 3){
            col = colors[2]
          } else if (magnitude >= 3 && magnitude < 4){
            col = colors[3]
          } else if (magnitude >= 4 && magnitude < 5){
            col = colors[4]
          } else {
            col = colors[5]
          }
          var cir = L.circleMarker([loc[1], loc[0]], {
                fillOpacity: .6,
                color: "greenF",
                fillColor: col,
                weight: 1,
                radius: magnitude * 3
          }).addTo(myMap);

    }

    // set up the legend in the lower right of the map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),

        grades = [0,1,2,3,4,5];
        div.innerHTML = '<h3>Quake Magnitude</h3>'
    // loop through our intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i class="legend" style="background:' + colors[i] + '; color:' + colors[i] + ';">....</i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '++');
  }
  return div;
};

legend.addTo(myMap);


}


// Perform an API call to the last 7 days earthquake data. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMap);

