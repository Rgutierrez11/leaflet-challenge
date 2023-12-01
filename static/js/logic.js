//store the URL for the GeoJSON data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

// Add a Leaflet tile layer.
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create a Leaflet map object.
var my_Map = L.map("map", {
    center: [47.09, -98.71],
    zoom: 5,
    layers: [streets]
});


//define basemaps as the streetmap
let base_Maps = {
    "streets": streets
};

//define the earthquake layergroup and tectonic plate layergroups for the map
let earthquakedata = new L.LayerGroup();
let tectonics = new L.LayerGroup();

//define the overlays and link the layergroups to separate overlays
let overlays = {
    "Earthquakes": earthquakedata,
    "Tectonic Plates": tectonics
};

//add a control layer and pass in baseMaps and overlays
L.control.layers(base_Maps, overlays).addTo(my_Map);

//this styleInfo function will dictate the stying for all of the earthquake points on the map
function styleInfo(feature) {
    return {
        color: changeColor(feature.geometry.coordinates[2]),
        radius: changeRadius(feature.properties.mag), //sets radius based on magnitude 
        fillColor: changeColor(feature.geometry.coordinates[2]) //sets fillColor based on the depth of the earthquake
    }
};

//define a function to choose the fillColor of the earthquake based on earthquake depth
function changeColor(depth) {
    if (depth >= -10 & depth <= 10) return "#008000";
    else if (depth > 10 & depth <= 30) return "#90EE90";
    else if (depth > 30 & depth <= 50) return "#008000";
    else if (depth > 50 & depth <= 70) return "#FFAE42";
    else if (depth > 70 & depth <= 90) return "#FFA500";
    else if (depth > 90) return "#FF0000";
    else return "#000000";
};
    



//define a function to determine the radius of each earthquake marker
function changeRadius(magnitude) {
    return magnitude*5;
};



//
d3.json(url).then(function (data) { //pull the earthquake JSON data with d3
    L.geoJson(data, {
        pointToLayer: function (feature, latlon) {  //declare a point to layer function that takes a feature and latlon
            return L.circleMarker(latlon).bindPopup(feature.id); //function creates a circleMarker at latlon and binds a popup with the earthquake id
        },
        style: styleInfo //style the CircleMarker with the styleInfo function as defined above
    }).addTo(earthquakedata); // add the earthquake data to the earthquake_data layergroup / overlay
    earthquakedata.addTo(my_Map);

    //this function pulls the tectonic plate data and draws a purple line over the plates
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (data) { //pulls tectonic data with d3.json
        L.geoJson(data, {
            color: "gold",  //sets the line color to gold
            weight: 3
        }).addTo(tectonics); //add the tectonic data to the tectonic layergroup / overlay
        tectonics.addTo(my_Map);
    });


});
//create legend, credit to this website for the structure: https://codepen.io/haakseth/pen/KQbjdO -- this structure is referenced in style.css
var legend = L.control({ position: "topright" });
legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "legend");
       div.innerHTML += "<h4>Depth Legend</h4>";
       div.innerHTML += '<i style="background: green"></i><span>(-10-10)</span><br>';
       div.innerHTML += '<i style="background: #90EE90"></i><span>(10-30)</span><br>';
       div.innerHTML += '<i style="background: yellow"></i><span>(30-50)</span><br>';
       div.innerHTML += '<i style="background: orange"></i><span>(50-70)</span><br>';
       div.innerHTML += '<i style="background: orange"></i><span>(70-90)</span><br>';
       div.innerHTML += '<i style="background: red"></i><span>(90+)</span><br>';
  
    return div;
  };
  //add the legend to the map
  legend.addTo(my_Map);

//scratch work for collecting the necessary  and console logging
//collect data with d3
d3.json(url).then(function (data) {
    console.log(data);
    let features = data.features;
    console.log(features);

    let results = features.filter(id => id.id == "ak023cldawqh"); //replace the id string with the argument of the function once created
    let first_result = results[0];
    console.log(first_result);
    let geometry = first_result.geometry;
    console.log(geometry);
    let coordinates = geometry.coordinates;
    console.log(coordinates);
    console.log(coordinates[0]); // longitude
    console.log(coordinates[1]); // latitude
    console.log(coordinates[2]); // depth of earthquake
    let magnitude = first_result.properties.mag;
    console.log(magnitude);
    //define depth variable
    let depth = geometry.coordinates[2];
    console.log(depth);
    let id = first_result.id;
    console.log(id);

});