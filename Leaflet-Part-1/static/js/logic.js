// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(queryUrl).then(function (data) {
  
// Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
  console.log(data);
});

// Function for Circle Color besed on the criteria. 
function markerSize(depth) {
  return depth * 5;
}
function markerColor(depth) {
  if (depth <= 10) {
      return "#daec92";
  } else if (depth <= 20) {
      return "#ecea92";
  } else if (depth <= 30) {
      return "#ecd592";
  } else if (depth <= 40) {
      return "#dfb778";
  } else if (depth <= 50) {
      return "#e5a05b";
  } else if (depth <= 60) {
      return "#e5a05b";
  } else {
      return "#f58668";
  }
};

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place, time, magnitude and depth of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h4> Place: ${feature.properties.place} </h4> <hr> 
    <h4> Date: ${new Date(feature.properties.time)}</h4><hr>
    <h4> Magnitude: ${feature.properties.mag}</h4> </hr>
    <h4> Depth: ${feature.geometry.coordinates[2]}</h4>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
   
let earthquakes = L.geoJSON(earthquakeData, {
  onEachFeature: onEachFeature,
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 0.3,
        opacity: 0.5,
        fillOpacity: 1
    });
},
onEachFeature: onEachFeature
});

// Sending our earthquakes layer to the createMap function
createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.apply only street map
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };


   // Create our map with streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  let legend = L.control({ 
    position: "bottomright" 
  });

  legend.onAdd = function(map) {
    let div = L.DomUtil.create("div", "info legend");
    depth = [-10, 10, 30, 50, 70, 90];
    labels = [];
    legendInfo = "<strong></strong>";
    div.innerHTML = legendInfo;
    // push to labels array as list item
    for (let i = 0; i <depth.length; i++) {
      // add label items to the div under the <ul> tag
       
        div.innerHTML += '<i style="background-color:' + markerColor(depth[i] + 1) +'""> </i> ' + depth[i] + (depth[i + 1] ? '&ndash;'  + depth[i + 1] + '<br>' : '+');
    }
      
    return div; 
};
// Add legend to the map
legend.addTo(myMap);
 
 
};


