import * as maplibregl from "maplibre-gl"




console.log(maplibregl);

var map = new maplibregl.Map({
  container: document.body,
  style: 'https://demotiles.maplibre.org/style.json', // stylesheet location
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9 // starting zoom
});
console.log(map);
