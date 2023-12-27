
  mapboxgl.accessToken = mapToken ;
  // console.log(mapToken);
const map = new mapboxgl.Map({
container: 'map', // container ID
style: "mapbox://styles/mapbox/streets-v12",
center: [72.8777,19.0760], // starting position [lng, lat]
zoom: 9 // starting zoom
});

