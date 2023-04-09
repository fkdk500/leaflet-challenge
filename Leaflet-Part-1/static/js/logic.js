// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function markerSize(magnitude) {
  return magnitude * 5;
}

function markerColor(magnitude) {
  if (magnitude <= 1) {
      return "#daec92"
  } else if (magnitude <= 2) {
      return "#ecea92"
  } else if (magnitude <= 3) {
      return "#ecd592"
  } else if (magnitude <= 4) {
      return "#dfb778"
  } else if (magnitude <= 5) {
      return "#e5a05b"
  } else {
      return "#f58668"
  }
};

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.time}</h3><hr><p>${new Date(feature.properties.mag)}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  /* let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: CircleMaker
  }); */
/*  */
  
let earthquakes = L.geoJSON(earthquakeData, {
  onEachFeature: onEachFeature,
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag),
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

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };
// Function for Circle Color Base on Criteria. The Color Scale is base of the 7 colors of a Rainboy ROY G BIV

 
  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });
    
  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function(map) {
      let div = L.DomUtil.create("div", "info legend");
      magnitudes = [0, 1, 2, 3, 4, 5];
      labels = [];
      legendInfo = "<strong>Magnitude</strong>";
      div.innerHTML = legendInfo;
      // push to labels array as list item
      for (let i = 0; i < magnitudes.length; i++) {
          labels.push('<li style="background-color:' + markerColor(magnitudes[i] + 1) + '"> <span>' + magnitudes[i] + (magnitudes[i + 1]
               ? '&ndash;' + magnitudes[i + 1] + '' : '+') + '</span></li>');
      }
      // add label items to the div under the <ul> tag
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
  };
  // Add legend to the map
  legend.addTo(myMap);

};


