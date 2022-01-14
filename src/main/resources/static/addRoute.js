let map;

window.initMap = function() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: { lat: 56.837950, lng: 60.603433},
  });

  directionsRenderer.setMap(map);
  var btn = document.getElementById("GetRoute")
  btn.onclick = function(){
    calculateAndDisplayRoute(directionsService, directionsRenderer);
    };
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  var origin = new google.maps.LatLng(56.843924, 60.653357);
  var destination = new google.maps.LatLng(56.836939, 60.595380);
  const waypoints = [];

  waypoints.push({
    location: new google.maps.LatLng(56.835554, 60.611643),
    stopover: true,
  });

  directionsService
    .route({
      origin: origin,
      destination: destination,
      waypoints: waypoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Directions request failed due to " + status));
}