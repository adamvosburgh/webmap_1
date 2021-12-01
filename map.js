'use strict'        // let the browser know we're serious

// debug statement letting us know the file is loaded
console.log('Loaded map.js')

// your mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbXZvc2J1cmdoIiwiYSI6ImNrOGE5MDhudzAzcHozbW82cTRnY201ZWEifQ.SyIq-l5sw9Ew6mGRLgfp1w'

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [-73.93324, 40.80877],
    zoom: 14
});

var trees_url = "./data/nyc_harlemriverstreettrees.geojson"
var buildings_url = "./data/nyc_harlemriverbldgs.geojson"

map.on('load',function(){
    // define a 'source' for your point dataset
    map.addSource('trees_data',{
      'type':'geojson',
      'data': "./data/nyc_harlemriverstreettrees.geojson"
    });
    // add a new layer with your points
    map.addLayer({
      'id':'trees',
      'type':'circle',
      'source':'trees_data',
      'paint':{
        'circle-radius':4,
        'circle-color': '#349f27',
        'circle-opacity':0.7
      },
    })
    // define a 'source' for your polygons dataset
    map.addSource('buildings',{
        'type':'geojson',
        'data': buildings_url,
      });
      // add a new layer with your polygons
      map.addLayer({
        'id':'buildings',
        'type':'fill',
        'source':'buildings',
        'paint':{
          'fill-color':'#888888',
          'fill-outline-color':'#000000'
        }
      })
      // ommitted map warper raster tiles - it appears that the project is deprecated
  });
  
  // when the user does a 'click' on an element in the 'trees' layer...
map.on('click', 'trees', function(e) {
    // get the map coordinates of the feature
    var coordinates = e.features[0].geometry.coordinates.slice();
    // get its species name from the feature's attributes
    var species = e.features[0].properties.spc_common;
  
    // and create a popup on the map
    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(species)
    .addTo(map);
  });
    
  // make the cursor a pointer when over the tree
  map.on('mouseenter', 'trees', function() {
    map.getCanvas().style.cursor = 'pointer';
  });
    
  // back to normal when it's not
  map.on('mouseleave', 'trees', function() {
    map.getCanvas().style.cursor = '';
  });
  