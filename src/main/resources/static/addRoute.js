let map;

function initMap() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6,
    center: { lat: 37.7699298, lng: -122.4469157 },
  });

  directionsRenderer.setMap(map);
  var btn = document.getElementById("Submit")
  btn.onclick = function(){
    calculateAndDisplayRoute(directionsService, directionsRenderer);
    };
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  var haight = new google.maps.LatLng(37.7699298, -122.4469157);
  var oceanBeach = new google.maps.LatLng(37.7683909618184, -122.51089453697205);
  const waypts = [];

  waypts.push({
    location: new google.maps.LatLng(11, 11),
    stopover: true,
  });

  directionsService
    .route({
      origin: haight,
      destination: oceanBeach,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Directions request failed due to " + status));
}