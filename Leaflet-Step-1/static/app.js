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
    function myStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // Color according to depth
    function getColor(depth) {
        return depth > 200 ? "#bd0026" :
               depth > 150 ? "#f03b20" :
            //    depth > 100 ? "#fd8d3c" :
               depth > 50  ? "#feb24c" :
                             "#fed976";
                            //  "#ffffb2";
    }
    
    function getRadius(mag) {
        if (mag === 0) {
            return 1;
        }
        return mag * 5;
    }

    // Add interaction
    // Mouseover event listener: highlight
    function highlightFeature(e) {
        var layer = e.target;
    
        layer.setStyle({
            weight: 3,
            color: '#666',
            dashArray: '',
            fillOpacity: 1
        });
    
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    // Mouseout
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
    }

    // Reset the layer
    var geojson;
        // ... our listeners // I don' know why but probably don't need ...
        geojson = L.geoJson();

    function onEachFeature(feature, layer) {
        // Interaction layer
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight
        });
        // The popup
        layer.bindPopup(`<h2>${feature.properties.place}</h2>
        <hr><p>Magnitude: ${feature.properties.mag}<br>${new Date(feature.properties.time)}</p>`); 
    }

    // Create a geoJSON layer with the retrieved data
    geojson = L.geoJson(data, {

        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
      
        style: myStyle,
        onEachFeature: onEachFeature
      
    }).addTo(myMap);

    // Create a legend
    var legend = L.control({position: "bottomright"});
    
    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "info legend"),
            grades = [1, 50, 150, 200],
            colors = ["#fed976", "#feb24c", "#f03b20", "#bd0026"];
    
    
        // loop thry the intervals of colors to put it in the label
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                "<i style='background: " + colors[i] + "'></i> " +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }

        return div;

    };
    
    legend.addTo(myMap)
});