function initMap() {
  let map, marker;
  let leafdeli = {lat: 47.327674, lng: -122.250382};
  map = new google.maps.Map(document.getElementById('google-map'), {
    center: leafdeli,
    zoom: 18
  });
  marker = new google.maps.Marker({position: leafdeli, map: map});
}