import {initializeApp} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import {getAnalytics} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-analytics.js";
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

const btn = document.getElementById("AddPlace");

btn.onclick = function(){
  const lat = $('#latitude').val();
  const lon = $('#longitude').val();
  const name = $('#name').val();
  const description = $('#description').val();
  const image = $('#image').get(0).files[0];
  const audio = $('#audio').get(0).files[0];
  let imgUrl;
  let audioUrl;
  const id = getGuid()
  const metaImg = {
    contentType: image.type
  };
  const metaAudio = {
    contentType: audio.type
  };
  uploadBytes(sRef(getStorage(),`PlacesGuidePhotos/`+id),image,metaImg).then((snapshot) =>{
    getDownloadURL(sRef(getStorage(),`PlacesGuidePhotos/`+id))
        .then((url) => {
          imgUrl = url
        });
    uploadBytes(sRef(getStorage(),`PlacesGuideAudio/`+id),audio,metaAudio).then((snapshot) =>{
      getDownloadURL(sRef(getStorage(),`PlacesGuideAudio/`+id))
          .then((url) => {
            audioUrl = url
            set(ref(getDatabase(), `Places/`+id),{
              id: id,
              latitude: lat,
              longitude: lon,
              name: name,
              description: description,
              img_url: imgUrl,
              audio: audioUrl
            });
          });
    });
  });
  document.getElementById("latitude").value = ""
  document.getElementById("longitude").value = ""
  document.getElementById("name").value = ""
  document.getElementById("description").value = ""
  document.getElementById("image").value = ""
  document.getElementById("audio").value = ""
  };

function getGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}