import {initializeApp} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import {child, get, getDatabase, ref, set} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js";
import {getStorage, getDownloadURL, uploadBytes, ref as sRef} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyAIYgp4_fQM9IN3P5GI2a_s2vxNz4ysrjQ",
  authDomain: "stenograffia.firebaseapp.com",
  databaseURL: "https://stenograffia-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "stenograffia",
  storageBucket: "stenograffia.appspot.com",
  messagingSenderId: "853799927087",
  appId: "1:853799927087:web:efd535db9adcf98a9bb5da",
  measurementId: "G-GT39XNP4PG"
};
const app = initializeApp(firebaseConfig);
const dbRef = ref(getDatabase());
var selectedWaypoints = new Array();
var firstPoint = ""
var secondPoint = ""

var selectorWaypoints = document.getElementById("selectorWaypoints");
var selectorFirstPoint = document.getElementById("firstPointSelector");
var selectorSecondPoint = document.getElementById("secondPointSelector");

var newOption = new Option("", "");
selectorFirstPoint.options[0]=newOption;
newOption = new Option("", "");
selectorSecondPoint.options[0]=newOption;

get(child(dbRef, `Places`)).then((snapshot) => {
    snapshot.forEach(function (child){
        var waypoint = child.val();
        var textSelect = waypoint.name;
        var valueSelect = waypoint.id;
        var newOption = new Option(textSelect, valueSelect);
        selectorWaypoints.options[selectorWaypoints.options.length]=newOption;
        newOption = new Option(textSelect, valueSelect);
        selectorFirstPoint.options[selectorFirstPoint.options.length]=newOption;
        newOption = new Option(textSelect, valueSelect);
        selectorSecondPoint.options[selectorSecondPoint.options.length]=newOption;
    });
 });

function changeWaypointsOption(){
    selectedWaypoints = new Array();
    for (let i = 0; i < selectorWaypoints.length; i++) {
        if (selectorWaypoints.options[i].selected) {
          selectedWaypoints.push(selectorWaypoints.options[i].value)
        }
    }
    checkEmptyAndDisplayRoute();
}

function checkEmptyAndDisplayRoute(){
    if(firstPoint!="" && secondPoint!=""){
        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        var map = new google.maps.Map(document.getElementById("map"));
        directionsRenderer.setMap(map);
        calculateAndDisplayRoute(directionsService, directionsRenderer);
    }
}

function changeFirstPointOption(){
    var i = selectorFirstPoint.options.selectedIndex;
    firstPoint = selectorFirstPoint.options[i].value;
    checkEmptyAndDisplayRoute();
}

function changeSecondPointOption(){
    var i = selectorSecondPoint.options.selectedIndex;
    secondPoint = selectorSecondPoint.options[i].value;
    checkEmptyAndDisplayRoute();
}

selectorFirstPoint.addEventListener("change", changeFirstPointOption);

selectorSecondPoint.addEventListener("change", changeSecondPointOption);

selectorWaypoints.addEventListener("change", changeWaypointsOption);

var addRoute = document.getElementById("AddRoute")

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    var origin = new google.maps.LatLng(56.843924, 60.653357);
    var destination = new google.maps.LatLng(56.836939, 60.595380);
    const waypoints = [];
    let firstPointId;
    let lastPointId;
    let pointsId = [];
    get(child(dbRef, `Places`)).then((snapshot) => {
    snapshot.forEach(function (child){
        var waypoint = child.val();
        var isFirstOrSecond = false
        if (waypoint.id == firstPoint)
        {
            origin = new google.maps.LatLng(waypoint.latitude, waypoint.longitude)
            isFirstOrSecond = true
            firstPointId = waypoint.id
        }
        if (waypoint.id == secondPoint)
        {
            destination = new google.maps.LatLng(waypoint.latitude, waypoint.longitude)
            isFirstOrSecond = true
            lastPointId = waypoint.id
        }
        if (selectedWaypoints.includes(waypoint.id) && !isFirstOrSecond){
            var marker = new google.maps.LatLng(waypoint.latitude, waypoint.longitude)
            waypoints.push({
                location: marker,
                stopover: true,
            });
            pointsId.push(waypoint.id);
        }
    });
    directionsService.route({
        origin: origin,
        destination: destination,
        waypoints: waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.WALKING,
    }).then((response) => {
        directionsRenderer.setDirections(response);
    }).catch((e) => window.alert("Directions request failed due to " + status));

    addRoute.onclick = function(){
        const name = $('#nameOfRoute').val();
        const description = $('#descriptionOfRoute').val();
        const length = $('#length').val();
        const popularPlaces = $('#popularPlaces').val();
        const images = $('#images').get(0).files;
        const metaImg = {
            contentType: images.type
        };
        pointsId.push(lastPointId);
        pointsId.unshift(firstPointId);

        get(ref(getDatabase(),`Routes`)).then((snapshot) => {
            let id = snapshot.size + 1
            set(ref(getDatabase(), `Routes/`+id.toString()),{
                Id: id.toString(),
                Name: name,
                Description: description,
                Length: length,
                PopularPlaces: popularPlaces,
                Points: pointsId
            });

            for(let i = 0; i < images.length; i++){
                console.log(images[i].name);
                uploadBytes(sRef(getStorage(),`PlacesPromoPhotos/`+id.toString()+`/`+images[i].name),images[i],metaImg).then((snapshot) =>{
                    getDownloadURL(sRef(getStorage(),`PlacesPromoPhotos/`+id.toString()+`/`+images[i].name))
                        .then((url) => {
                            set(ref(getDatabase(), `Routes/`+id.toString()+`/PromoImgs/`+i.toString()),url);
                        });
                });
            }
        });

        document.getElementById("nameOfRoute").value = ""
        document.getElementById("descriptionOfRoute").value = ""
        document.getElementById("length").value = ""
        document.getElementById("popularPlaces").value = ""
        document.getElementById("firstPointSelector").value = ""
        document.getElementById("secondPointSelector").value = ""
    };

    });
}