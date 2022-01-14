import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-analytics.js";
import { getDatabase, ref, child, get, set } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js";
import { randomUUID } from "crypto";

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
const analytics = getAnalytics(app);

const dbRef = ref(getDatabase());
          get(child(dbRef, `SurfaceExchange`)).then((snapshot) => {
              var content = '';
              snapshot.forEach(function (child){
                var value = child.val();
                content+='<tr>';
                content+='<td rowspan="6" width="500" height="500">';
                content+='<img width="500" height="500" id="img" src="'+value.imgUrlForExchange+'"/>';
                content+='</td>';
                content+='</tr>';
                content+='<tr>';
                content+='<td rowspan="6" width="20" height="500"></td>';
                content+='</tr>';
                content+='<tr>';
                content+='<td height="10" class="lead"><h5>Адресс:</h5></td>';
                content+='</tr>';
                content+='<tr>';
                content+='<td height="100">';
                content+='<div id="address" class="lead">'+value.address+'</div>';
                content+='</td>';
                content+='</tr>';
                content+='<tr>';
                content+='<td height="10" class="lead"><h5>Описание:</h5></td>';
                content+='</tr>';
                content+='<tr>';
                content+='<td height="200">';
                content+='<div id="description" class="lead">'+value.description+'</div>';
                content+='</td>';
                content+='</tr>';
                console.log(value.imgUrlForExchange);
                console.log(value.address);
                console.log(value.description);
              });
              $('#table').append(content);
          });

var btn = document.getElementById("AddPlace")

  btn.onclick = function(){
  var lat = $('#latitude').val();
  var lon = $('#longitude').val();
  var name = $('#name').val();
  var description = $('#description').val();
  var image = $('#image').val();
  var audio = $('#audio').val();
  let id = randomUUID();

  set(ref(getDatabase(), `AllPlaces/`+id),{
    id: id,
    latitude: lat,
    longitude: lon,
    name: name,
    description: description,
    img_url: image,
    audio: audio
  });
//  get(child(dbRef, `AllPlaces`)).then((snapshot) => {
//  console.log(snapshot.size);
//    const db = getDatabase();
//        set(ref(db, `AllPlaces/`+snapshot.size),{
//            latitude: lat,
//            longitude: lon,
//            name: name
//        });
//  });
    document.getElementById("latitude").value = ""
    document.getElementById("longitude").value = ""
    document.getElementById("name").value = ""
  };