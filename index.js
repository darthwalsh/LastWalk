var firebaseConfig = {
  apiKey: "AIzaSyD5dGDgA23L_4tlJqZeuWEMuKoq4IBe0yE",
  authDomain: "last-walk.firebaseapp.com",
  databaseURL: "https://last-walk.firebaseio.com",
  projectId: "last-walk",
  storageBucket: "last-walk.appspot.com",
  messagingSenderId: "711055835479",
  appId: "1:711055835479:web:bfe62c07fca24517"
};
firebase.initializeApp(firebaseConfig);

function $(id) {
  return document.getElementById(id);
}

const params = new URLSearchParams(window.location.search);
const dogId = params.get("id");

const database = firebase.database();
let ref;

const last = { };

function onClick(prefix) {
  return () => {
    const newMillis = new Date().getTime();
    database.ref(`${dogId}/${prefix}`).set(newMillis);
  }
}

function init(prefix) {
  $(prefix).onclick = onClick(prefix);

  ref.on("value", snapShot => last[prefix] = snapShot.val()[prefix]);
  
  setInterval(() => {
    if (!last[prefix]) {
      return;
    }
    const millis = new Date().getTime() - last[prefix];
    let minutes = Math.floor(millis / 60000);
    const hours = Math.floor(minutes / 60);
    minutes %= 60;
    minutes = minutes.toString();
    if (minutes.length === 1) {
      minutes = "0" + minutes;
    }
    $(`${prefix}time`).textContent = `${hours}:${minutes}`;
  }, 1);
}

window.onload = () => {
  if (dogId) {
    ref = database.ref(dogId);
    init("walk");
    init("poo");
    ref.once("value", snapshot => $("name").textContent = snapshot.val().name)
  } else {
    $("add").style.visibility = "";
    const newId = Math.random().toString(36).substring(2);

    $("addName").addEventListener("input", e => 
      $("addDog").disabled = !Boolean(e.target.value.length));
    $("addDog").onclick = () => {
      database.ref(newId).set({
        name: $("addName").value,
      }, err => {
        if (err) {
          alert("Write failure: " + error.toString());
        } else {
          const url = new URL(window.location);
          url.searchParams.set("id", newId);
          window.location.replace(url.toString());
        }
      });
    }
  }
  
  $("aboutLink").onclick = () => $("about").style.visibility = "";
  $("about").onclick = () => $("about").style.visibility = "hidden";
};

