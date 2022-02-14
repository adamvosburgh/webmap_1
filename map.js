'use strict'        // let the browser know we're serious

// debug statement letting us know the file is loaded
console.log('Loaded map.js')

// your mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbXZvc2J1cmdoIiwiYSI6ImNrOGE5MDhudzAzcHozbW82cTRnY201ZWEifQ.SyIq-l5sw9Ew6mGRLgfp1w'

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [ -73.94829, 40.80781],
    zoom: 13.75
});

var blocks_url = "./data/blocks_joined_trees_um.geojson"
var trees_url = "./data/2015_Street_Tree_Census_subset_um.geojson"

map.on('load',function(){
  // define a 'source' for your polygons dataset
  map.addSource('blocks_data',{
    'type':'geojson',
    'data': blocks_url,
  });
  // add a new layer with your polygons
  map.addLayer({
    'id':'blocks',
    'type':'fill',
    'source':'blocks_data',
    'paint':{
        'fill-color': 
          ['case', 
          ['==', ['get', 'avg_diamet'], null],
          'white',
          ['step', ['get', 'avg_diamet'],
            '#ffffff',
            2.615, '#edf8e9',
            6.444, '#bae4b3',
            9.379, '#74c476',
            15.036, '#31a354',
            26.000, '#006d2c'
          ]],
      'fill-outline-color':'#000000',
      'fill-opacity': 0.5
    }
  })
  // define a 'source' for your point dataset
    map.addSource('trees_data',{
      'type':'geojson',
      'data': trees_url
    });
    // add a new layer with your points
    map.addLayer({
      'id':'trees',
      'type':'circle',
      'source':'trees_data',
      'paint':{
        'circle-color': '#349f27',
        'circle-opacity':0.7,
        'circle-radius': ['/', ['get', 'tree_dbh'], 5],
      },
    })
    
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
  