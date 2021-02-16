// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

// Create map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Add light map tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
}).addTo(myMap);
  
// Grabbing our GeoJSON data..
d3.json(queryUrl, function(data) {
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: mapColor(feature.properties.mag),
            color: "#000000",
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    function mapColor(mag) {
        switch (true) {
            case mag > 5:
                return "#ea2c2c";
            case mag > 4:
                return "#eaa92c";
            case mag > 3:
                return "#d5ea2c";
            case mag > 2:
                return "#92ea2c";
            case mag > 1:
                return "#2ceabf";
            default:
                return "#2c99ea";
        }
    }
    
    function mapRadius(mag) {
        if (mag === 0) {
            return 1;
        }
        return mag * 4;
    }

    // Creating a geoJSON layer with the retrieved data
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
      
        style: mapStyle,
      
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h2>${feature.properties.place}</h2>
            <hr><p>Magnitude: ${feature.properties.mag}<br>${new Date(feature.properties.time)}</p>`);      
        }
    }).addTo(myMap);
});
  
